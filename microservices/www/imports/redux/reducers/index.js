import { combineReducers } from 'redux';
import { persistReducer, createTransform } from 'redux-persist';
import { reducer as formReducer } from 'redux-form';

import widget1 from './widget1';

const createPersistedReducer = (reducer, isClient) => {
  if (isClient) {
    const { default: storage } = require('redux-persist/lib/storage');
    const persistConfig = { key: 'root', storage };
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
