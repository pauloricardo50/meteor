import { combineReducers } from 'redux';

import widget1 from 'core/redux/widget1';

import stepperReducer from './stepper';

const createRootReducer = () =>
  combineReducers({ stepper: stepperReducer, widget1 });

export default createRootReducer;
