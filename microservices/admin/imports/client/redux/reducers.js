import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import financingStructuresReducer from 'core/redux/financingStructures';
import sidenavReducer from './sidenav';

const createRootReducer = () =>
  combineReducers({
    sidenav: sidenavReducer,
    financingStructures: financingStructuresReducer,
    form: formReducer,
  });

export default createRootReducer;
