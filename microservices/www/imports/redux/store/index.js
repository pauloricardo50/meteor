import { createStore, applyMiddleware } from 'redux';
import createRootReducer from '../reducers';

const createCustomStore = ({ initialState = {} } = {}) => {
  const rootReducer = createRootReducer();
  const middlewares = [];

  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middlewares)
  );
};

export default createCustomStore;
