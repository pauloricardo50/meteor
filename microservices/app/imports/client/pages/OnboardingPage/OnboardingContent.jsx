import React from 'react';

import Button from 'core/components/Button';
import T from 'core/components/Translation';

import { useOnboarding } from './OnboardingContext';
import { steps } from './onboardingHelpers';

const OnboardingContent = () => {
  const { activeStep } = useOnboarding();
  const { Component } = steps.find(({ id }) => id === activeStep);

  return (
    <div className="onboarding-content">
      <Component />

      <div className="next-step">
        <Button raised secondary>
          <T id={`OnboardingContent.${activeStep}.next`} />
        </Button>
      </div>
    </div>
  );
};

export default OnboardingContent;
