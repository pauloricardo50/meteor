import { steps } from './onboardingSteps';

export const getStepIds = () => steps.filter(x => x).map(({ id }) => id);
