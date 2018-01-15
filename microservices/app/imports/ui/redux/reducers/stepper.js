const initialState = { activeStep: -1 };

export const stepperActions = {
  SET_STEP: 'SET_STEP',
  HIDE_STEPS: 'HIDE_STEPS',
};

const stepper = (state = initialState, action) => {
  switch (action.type) {
    case stepperActions.SET_STEP:
      return { ...state, activeStep: action.step };
    case stepperActions.HIDE_STEPS:
      return initialState;
    default:
      return state;
  }
};

export default stepper;
