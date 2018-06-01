import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import stepper from './stepper';

const createRootReducer = () => combineReducers({ stepper, form: formReducer });

export default createRootReducer;
