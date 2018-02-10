import { combineReducers } from 'redux';
import stepper from './stepper';

const createRootReducer = () => combineReducers({ stepper });

export default createRootReducer;
