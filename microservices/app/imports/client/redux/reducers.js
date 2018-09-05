import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import financingStructuresReducer from 'core/redux/financingStructures';
import widget1 from 'core/redux/widget1';
import stepperReducer from './stepper';

const createRootReducer = () =>
  combineReducers({
    stepper: stepperReducer,
    financingStructures: financingStructuresReducer,
    widget1,
    form: formReducer,
  });

export default createRootReducer;
