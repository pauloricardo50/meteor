import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import stepperReducer from './stepper';

const createRootReducer = () =>
  combineReducers({ stepper: stepperReducer, form: formReducer });

export default createRootReducer;
