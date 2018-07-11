import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import financingStructuresReducer from 'core/redux/financingStructures';
import stepperReducer from './stepper';

const createRootReducer = () =>
  combineReducers({
    stepper: stepperReducer,
    financingStructures: financingStructuresReducer,
    form: formReducer,
  });

export default createRootReducer;
