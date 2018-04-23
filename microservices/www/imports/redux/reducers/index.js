import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { reducer as formReducer } from 'redux-form';

import widget1 from './widget1';

const PERSIST_STORE = true;
// This whitelist essentially disabled redux-persist.
// Remove it when we are confident the calculator is really stable. Or else it
// persists faulty state and makes the site unusable for a user
const persistWhitelist = [];

const createPersistedReducer = (reducer, isClient) => {
  if (PERSIST_STORE && isClient) {
    const { default: storage } = require('redux-persist/lib/storage');
    const persistConfig = { key: 'root', storage, whitelist: persistWhitelist };
    return persistReducer(persistConfig, reducer);
  }
  return reducer;
};

const appReducer = (state, action) => {
  // Add a global RESET action that sets the state to its initial value
  if (action.type === 'RESET') {
    state = undefined;
  }
  return combineReducers({ widget1, form: formReducer })(state, action);
};

const createRootReducer = (isClient) => {
  const rootReducer = appReducer;
  return createPersistedReducer(rootReducer, isClient);
};

export default createRootReducer;
