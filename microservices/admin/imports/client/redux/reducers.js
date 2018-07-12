import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import sidenavReducer from './sidenav';

const createRootReducer = () =>
  combineReducers({ sidenav: sidenavReducer, form: formReducer });

export default createRootReducer;
