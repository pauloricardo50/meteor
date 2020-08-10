import React from 'react';

import OnboardingChoice from './OnboardingComponents/OnboardingChoice';
import OnboardingResult from './OnboardingComponents/OnboardingResult';
import { useOnboarding } from './OnboardingContext';
import { steps } from './onboardingSteps';

const Components = {
  OnboardingChoice,
  OnboardingResult,
};

const OnboardingContent = () => {
  const { activeStep } = useOnboarding();
  const { component, id, props } = steps.find(({ id }) => id === activeStep);
  const Component = Components[component];

  return (
    <div className="onboarding-content">
      <Component id={id} key={id} {...props} />
    </div>
  );
};

export default OnboardingContent;
