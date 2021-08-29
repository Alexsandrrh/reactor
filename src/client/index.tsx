import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes/Routes';
import createStore from './store';

const rootContainer = document.getElementById('root');
const preloadedStateContainer = document.getElementById('__PRELOADED_STATE__');
const preloadedState = JSON.parse(preloadedStateContainer.innerHTML ?? '{}');

const store = createStore(preloadedState);

ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<Routes />
		</BrowserRouter>
	</Provider>,
	rootContainer,
);

if (module.hot) {
	module.hot.accept();
}
