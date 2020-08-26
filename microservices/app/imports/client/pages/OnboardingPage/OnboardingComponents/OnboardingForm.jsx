import React, { useMemo } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
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
    [schema],
  );

  return (
    <MuiThemeProvider
      theme={{
        props: {
          // Make inputs a bit larger for comfort during onboarding
          MuiFormControl: { size: 'medium', variant: 'outlined' },
          MuiTextField: { size: 'medium', variant: 'outlined' },
        },
      }}
    >
      <OnboardingStep>
        <div className={cx('onboarding-form', className)}>
          <AutoForm
            schema={finalSchema}
            model={model || loan}
            onSubmit={onSubmit}
            onSubmitSuccess={handleNextStep}
            submitFieldProps={{
              label: submitLabel,
              size: 'large',
              secondary: true,
              keepLoading: true,
            }}
            layout={layout}
            {...autoFormProps}
          />
        </div>
      </OnboardingStep>
    </MuiThemeProvider>
  );
};

export default OnboardingForm;
