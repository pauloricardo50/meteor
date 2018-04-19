import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import widget1 from './widget1';

const persistConfig = { key: 'root', storage };

const createPersistedReducer = reducer =>
  persistReducer(persistConfig, reducer);

const createRootReducer = () =>
  createPersistedReducer(combineReducers({ widget1 }));

export default createRootReducer;
