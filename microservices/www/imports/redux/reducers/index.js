import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';

import widget1 from './widget1';

const createPersistedReducer = (reducer, isClient) => {
  if (isClient) {
    const { default: storage } = require('redux-persist/lib/storage');
    const persistConfig = { key: 'root', storage };
    return persistReducer(persistConfig, reducer);
  }
  return reducer;
};
const createRootReducer = (isClient) => {
  const rootReducer = combineReducers({ widget1 });
  return createPersistedReducer(rootReducer, isClient);
};

export default createRootReducer;
