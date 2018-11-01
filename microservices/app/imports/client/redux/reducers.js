import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import widget1 from 'core/redux/widget1';
import stepperReducer from './stepper';

const createRootReducer = () =>
  combineReducers({
    stepper: stepperReducer,
    widget1,
    form: formReducer,
  });

export default createRootReducer;
