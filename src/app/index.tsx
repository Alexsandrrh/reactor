import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { loadableReady } from '@loadable/component';
import Routes from './routes/Routes';
import './assets/css/main.css';

loadableReady(() => {
	const rootContainer = document.getElementById('app');

	ReactDOM.render(
		<React.StrictMode>
			<BrowserRouter>
				<Routes />
			</BrowserRouter>
		</React.StrictMode>,
		rootContainer,
	);
});

if (module.hot) {
	module.hot.accept();
}
