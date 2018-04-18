import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import createRootReducer from '../reducers';

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      name: 'e-Potek Www',
    })
    : compose;

const enhancer = middlewares =>
  composeEnhancers(applyMiddleware(...middlewares),
    // other store enhancers if any
  );

const setMiddlewares = () => {
  const middlewares = [];

  middlewares.push(thunk);

  if (process.env.NODE_ENV !== 'production') {
    const logger = createLogger();
    middlewares.push(logger);
  }

  return middlewares;
};

const createCustomStore = ({ preloadedState } = {}) => {
  const rootReducer = createRootReducer();
  const middlewares = setMiddlewares();

  return createStore(rootReducer, preloadedState, enhancer(middlewares));
};

export default createCustomStore;
