import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';

import widget1Reducer from 'core/redux/widget1';

const PERSIST_STORE = true;

const createPersistedReducer = (reducer, isClient) => {
  if (PERSIST_STORE && isClient) {
    const { default: storage } = require('redux-persist/lib/storage');
    // Weird SSR issues with redux-persist
    // To try using it, remove the whitelist, and refresh from the
    // widget1 page for example, server and client-side store are not the same
    const persistConfig = { key: 'root', storage, whitelist: [] };
    return persistReducer(persistConfig, reducer);
  }
  return reducer;
};

const appReducer = (state, action) => {
  // Add a global RESET action that sets the state to its initial value
  if (action.type === 'RESET') {
    state = undefined;
  }
  return combineReducers({ widget1: widget1Reducer })(state, action);
};

const createRootReducer = isClient => {
  const rootReducer = appReducer;
  return createPersistedReducer(rootReducer, isClient);
};

export default createRootReducer;
