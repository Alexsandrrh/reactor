import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

const CS = (preloadedState: any = {}) => {
	return createStore(reducers, preloadedState, applyMiddleware(thunk));
};

const initiateStore = CS();

export type Store = ReturnType<typeof initiateStore.getState>;
export default CS;
