import * as stepperTypes from './stepperTypes';

export const setStep = step => ({
  type: stepperTypes.SET_STEP,
  step,
});

export const hideSteps = step => ({
  type: stepperTypes.HIDE_STEPS,
  step,
});
