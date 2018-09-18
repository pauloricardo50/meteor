import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import financingReducer from 'core/redux/financing';
import sidenavReducer from './sidenav';

const createRootReducer = () =>
  combineReducers({
    sidenav: sidenavReducer,
    financing: financingReducer,
    form: formReducer,
  });

export default createRootReducer;
