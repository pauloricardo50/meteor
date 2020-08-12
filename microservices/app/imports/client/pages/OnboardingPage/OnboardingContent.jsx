import React, { useEffect } from 'react';

import OnboardingChoice from './OnboardingComponents/OnboardingChoice';
import OnboardingForm from './OnboardingComponents/OnboardingForm';
import OnboardingResult from './OnboardingComponents/OnboardingResult/OnboardingResult';
import { useOnboarding } from './OnboardingContext';
import { steps } from './onboardingSteps';

const Components = {
  OnboardingChoice,
  OnboardingResult,
  OnboardingForm,
};

const OnboardingContent = () => {
  const { activeStep, stepIds, resetPosition } = useOnboarding();
  const step = steps.find(({ id }) => id === activeStep);
  const isBadStep = !step || !stepIds.includes(activeStep);

  useEffect(() => {
    if (isBadStep) {
      resetPosition();
    }
  }, [isBadStep]);

  if (isBadStep) {
    return null;
  }

  const { component, id, props } = step;
  const Component = Components[component];

  return (
    <div className="onboarding-content">
      <Component id={id} key={id} {...props} />
    </div>
  );
};

export default OnboardingContent;
