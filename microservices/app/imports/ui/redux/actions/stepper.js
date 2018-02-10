import { stepperActions } from '../reducers/stepper';

export const setStep = step => ({
  type: stepperActions.SET_STEP,
  step,
});

export const hideSteps = step => ({
  type: stepperActions.HIDE_STEPS,
  step,
});
