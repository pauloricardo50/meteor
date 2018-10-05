import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import financingReducer from 'core/redux/financing';
import widget1 from 'core/redux/widget1';
import stepperReducer from './stepper';

const createRootReducer = () =>
  combineReducers({
    stepper: stepperReducer,
    financing: financingReducer,
    widget1,
    form: formReducer,
  });

export default createRootReducer;
