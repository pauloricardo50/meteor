import { createStore, applyMiddleware } from 'redux';
import createRootReducer from './reducers';

const createCustomStore = () => {
  const initialState = {};
  const middlewares = [];
  const rootReducer = createRootReducer();
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middlewares),
  );
};

export default createCustomStore;
