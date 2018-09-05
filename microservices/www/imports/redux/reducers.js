import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { reducer as formReducer } from 'redux-form';

import widget1Reducer from 'core/redux/widget1';

const PERSIST_STORE = true;

const createPersistedReducer = (reducer, isClient) => {
  if (PERSIST_STORE && isClient) {
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
  return combineReducers({ widget1: widget1Reducer, form: formReducer })(
    state,
    action,
  );
};

const createRootReducer = (isClient) => {
  const rootReducer = appReducer;
  return createPersistedReducer(rootReducer, isClient);
};

export default createRootReducer;
