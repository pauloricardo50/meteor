import React, { useMemo } from 'react';
import cx from 'classnames';

import AutoForm from 'core/components/AutoForm2';

import { useOnboarding } from '../OnboardingContext';
import OnboardingStep from './OnboardingStep';

const OnboardingForm = ({
  schema,
  onSubmit,
  submitLabel,
  className,
  layout,
  model,
  autoFormProps,
}) => {
  const { handleNextStep, loan } = useOnboarding();
  const finalSchema = useMemo(
    () => (typeof schema === 'function' ? schema(loan) : schema),
    [],
  );

  return (
    <OnboardingStep>
      <div className={cx('onboarding-form', className)}>
        <AutoForm
          schema={finalSchema}
          model={model || loan}
          onSubmit={onSubmit}
          onSubmitSuccess={() => handleNextStep(0)}
          submitFieldProps={{ label: submitLabel, size: 'large' }}
          layout={layout}
          {...autoFormProps}
        />
      </div>
    </OnboardingStep>
  );
};

export default OnboardingForm;
