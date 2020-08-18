import React, { useEffect } from 'react';

import OnboardingBorrowersForm from './OnboardingComponents/OnboardingBorrowersForm';
import OnboardingChoice from './OnboardingComponents/OnboardingChoice';
import OnboardingForm from './OnboardingComponents/OnboardingForm';
import OnboardingResult from './OnboardingComponents/OnboardingResult/OnboardingResult';
import { useOnboarding } from './OnboardingContext';
import { steps } from './onboardingSteps';

const Components = {
  OnboardingChoice,
  OnboardingResult,
  OnboardingForm,
  OnboardingBorrowersForm,
};

const OnboardingContent = () => {
  const { activeStep, stepIds, resetPosition, loan } = useOnboarding();
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

  const { component, id, props, onSubmit } = step;
  const Component = Components[component];

  return (
    <div className="onboarding-content">
      <Component id={id} key={id} {...props} onSubmit={onSubmit?.(loan)} />
    </div>
  );
};

export default OnboardingContent;
