import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from 'reducers';

const createStoreWithMiddleware = compose(
    applyMiddleware(
        thunkMiddleware
    ),
    typeof window !== 'undefined' && window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

function configureStore(initialState = {}) {
    const store = createStoreWithMiddleware(rootReducer, initialState);

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('reducers', () => {
            const nextReducer = require('reducers');

            store.replaceReducer(nextReducer);
        });
    }

    return store;
}

export const buildStore = () => configureStore();

export default buildStore();
