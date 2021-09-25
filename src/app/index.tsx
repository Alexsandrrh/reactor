import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { loadableReady } from '@loadable/component';
import Routes from './routes/Routes';
import createStore from './store';
import './assets/css/main.css';

loadableReady(() => {
	const rootContainer = document.getElementById('app');
	const preloadedStateContainer = document.getElementById(
		'__PRELOADED_STATE__',
	);
	const preloadedState = JSON.parse(preloadedStateContainer?.innerHTML ?? '{}');

	const store = createStore(preloadedState);

	ReactDOM.render(
		<React.StrictMode>
			<Provider store={store}>
				<BrowserRouter>
					<Routes />
				</BrowserRouter>
			</Provider>
		</React.StrictMode>,
		rootContainer,
	);
});

if (module.hot) {
	module.hot.accept();
}
