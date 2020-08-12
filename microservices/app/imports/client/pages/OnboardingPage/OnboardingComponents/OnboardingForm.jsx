import React from 'react';

import AutoForm from 'core/components/AutoForm2';

import { useOnboarding } from '../OnboardingContext';
import OnboardingStep from './OnboardingStep';

const OnboardingForm = ({
  loan,
  schema,
  onSubmit = () => Promise.resolve(),
  submitLabel,
}) => {
  const { handleNextStep } = useOnboarding();

  return (
    <OnboardingStep>
      <div className="onboarding-form">
        <AutoForm
          schema={schema}
          model={loan}
          onSubmit={onSubmit}
          onSubmitSuccess={handleNextStep}
          submitFieldProps={{
            label: submitLabel,
            size: 'large',
          }}
        />
      </div>
    </OnboardingStep>
  );
};

export default OnboardingForm;
