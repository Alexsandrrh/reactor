import * as Redux from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

let compose = Redux.compose;

// Для режима разработки на клиенте
if (IS_DEV && IS_CLIENT === 'true') {
	compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?? Redux.compose;
}

const createStore = (initialState: any = {}) =>
	Redux.createStore(
		reducers,
		initialState,
		compose(Redux.applyMiddleware(thunk)),
	);

const rootStore = createStore();

export type Store = ReturnType<typeof rootStore.getState>;
export default createStore;
