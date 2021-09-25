import React from 'react';
import app from './app';
import { Request, Response } from 'express';
import path from 'path';
import ReactDOMServer from 'react-dom/server';
import HTML from './HTML';
import { ChunkExtractor } from '@loadable/server';
import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';
import Routes from '../app/routes/Routes';
import createStore from '../app/store';
import { StaticRouter, StaticRouterContext } from 'react-router';

const statsFile: string = path.resolve('dist', 'loadable-stats.json');

app.get('/*', async (req: Request, res: Response) => {
	// Создаем состояние на сервере
	const store = createStore();

	Promise.all([]).finally(async () => {
		// Создаем экстрактор для поиска файлов и добавления их HTML
		const extractor = new ChunkExtractor({
			statsFile,
			entrypoints: ['bundle'],
		});

		// Создаем контекст для роутинга
		const context: StaticRouterContext = {};

		// Рендерим наш интерфейс
		const markup = ReactDOMServer.renderToString(
			extractor.collectChunks(
				<Provider store={store}>
					<StaticRouter context={context} location={req.url}>
						<Routes />
					</StaticRouter>
				</Provider>,
			),
		);

		// Достаем нужные данные для SEO и SVG
		const helmet = Helmet.renderStatic();
		// @ts-ignore
		const sprite = await import('svg-sprite-loader/runtime/sprite.build');

		const stream = ReactDOMServer.renderToNodeStream(
			<HTML
				helmet={helmet}
				sprite={sprite}
				extractor={extractor}
				markup={markup}
				preloadedState={store.getState()}
			/>,
		);

		res.type('text/html; charset=utf-8');
		res.status(context.statusCode ?? 200);
		res.write('<!DOCTYPE html>');
		stream.pipe(res, { end: true });
	});
});