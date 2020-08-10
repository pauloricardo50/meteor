import React from 'react';

import Button from 'core/components/Button';
import T from 'core/components/Translation';

import { useOnboarding } from '../OnboardingContext';

const OnboardingStep = ({ title, description, children, withCta }) => {
  const { activeStep } = useOnboarding();
  return (
    <div className="animated fadeIn">
      <h2 className="text-center">{title}</h2>
      <p className="secondary text-center">{description}</p>

      {children}

      {withCta && (
        <div>
          <Button raised secondary>
            <T id={`OnboardingStep.cta.${activeStep}`} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default OnboardingStep;
