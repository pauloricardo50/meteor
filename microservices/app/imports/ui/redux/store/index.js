import { createStore, applyMiddleware } from 'redux';
import createRootReducer from '../reducers';

const createCustomStore = ({ collections }) => {
  const initialState = {};
  const middlewares = [];
  const rootReducer = createRootReducer({ collections });
  return () =>
    createStore(rootReducer, initialState, applyMiddleware(...middlewares));
};

export default createCustomStore;
