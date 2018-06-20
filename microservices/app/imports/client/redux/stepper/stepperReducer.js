import * as stepperTypes from './stepperTypes';

const initialState = { activeStep: -1 };

const stepper = (state = initialState, action) => {
  switch (action.type) {
  case stepperTypes.SET_STEP:
    return { ...state, activeStep: action.step };
  case stepperTypes.HIDE_STEPS:
    return initialState;
  default:
    return state;
  }
};

export default stepper;
