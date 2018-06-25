import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { persistStore } from 'redux-persist';

import createRootReducer from './reducers';

const isClient = typeof window === 'object';
const composeEnhancers =
  isClient && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      name: 'e-Potek Www',
    })
    : compose;

// Add other store enhancers if any
const enhancer = middlewares =>
  composeEnhancers(applyMiddleware(...middlewares));

const getMiddlewares = () => {
  const middlewares = [];

  middlewares.push(thunk);

  if (isClient && process.env.NODE_ENV !== 'production') {
    const logger = createLogger();
    middlewares.push(logger);
  }

  return middlewares;
};

const createCustomStore = ({ preloadedState } = {}) => {
  const rootReducer = createRootReducer(isClient);
  const middlewareEnhancer = enhancer(getMiddlewares());
  const store = createStore(rootReducer, preloadedState, middlewareEnhancer);
  const persistor = persistStore(store);
  return { store, persistor };
};

export default createCustomStore;
