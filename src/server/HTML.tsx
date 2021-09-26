import React, { FC, ReactElement } from 'react';
import { ChunkExtractor } from '@loadable/server';
import { HelmetData } from 'react-helmet';

interface Props {
	helmet: HelmetData;
	sprite: any;
	extractor: ChunkExtractor;
	markup: string;
}

const HTML: FC<Props> = ({
	helmet,
	sprite,
	extractor,
	markup,
}): ReactElement => {
	// React Helmet
	const htmlAttr = helmet.htmlAttributes.toComponent();
	const bodyAttr = helmet.bodyAttributes.toComponent();

	// Sprite
	const symbols = sprite.symbols.map((symbol: any) => symbol.content).join('');

	return (
		<html lang="en" {...htmlAttr}>
			<head>
				{helmet.title.toComponent()}
				{helmet.meta.toComponent()}
				{helmet.link.toComponent()}
				{helmet.style.toComponent()}
				{helmet.script.toComponent()}
				{helmet.noscript.toComponent()}
				<meta charSet="UTF-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<meta
					name="viewport"
					content="width=device-width, maximum-scale=1, initial-scale=1"
				/>
				{extractor.getLinkElements()}
				{extractor.getStyleElements()}
			</head>
			<body {...bodyAttr}>
				<svg
					id="__SVG_SPRITE_NODE__"
					xmlns="https://www.w3.org/2000/svg"
					xmlnsXlink="https://www.w3.org/1999/xlink"
					style={{
						display: 'none',
						position: 'absolute',
						width: '0',
						height: '0',
					}}
					dangerouslySetInnerHTML={{
						__html: symbols,
					}}
				/>
				<div id="app" dangerouslySetInnerHTML={{ __html: markup }} />
				{extractor.getScriptElements()}
			</body>
		</html>
	);
};

export default HTML;
