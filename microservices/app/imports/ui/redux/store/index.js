import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers';

const initialState = {};
const middlewares = [];

const createCustomStore = () =>
  createStore(rootReducer, initialState, applyMiddleware(...middlewares));

export default createCustomStore;
