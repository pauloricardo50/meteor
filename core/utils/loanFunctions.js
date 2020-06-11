import { STEPS } from '../api/loans/loanConstants';

export const shouldSendStepNotification = (prevStep, nextStep) =>
  (prevStep === STEPS.SOLVENCY || prevStep === STEPS.REQUEST) &&
  nextStep === STEPS.OFFERS;
