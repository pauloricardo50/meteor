import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import { financingMiddleware } from 'core/redux/financing';
import createRootReducer from './reducers';

const createCustomStore = () => {
  const initialState = {};
  const middlewares = [createLogger(), ...financingMiddleware];
  const rootReducer = createRootReducer();

  const composeEnhancers = typeof window === 'object'
    && process.env.NODE_ENV === 'development'
    && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ name: 'e-Potek Admin' })
    : compose;

  const enhancer = composeEnhancers(applyMiddleware(...middlewares));
  return createStore(rootReducer, initialState, enhancer);
};

export default createCustomStore;
