import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from '../reducer/reducer'

let store = null;

const middleware = applyMiddleware(thunk);

// eslint-disable-next-line
export default (state = {}) => {
    store = createStore(reducer, state, middleware);
    return store;
}

export function getStore() {
    return store;
}