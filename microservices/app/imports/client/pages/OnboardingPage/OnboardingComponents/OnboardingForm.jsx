import React, { useMemo } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import cx from 'classnames';

import AutoForm from 'core/components/AutoForm2';
import T from 'core/components/Translation';

import { useOnboarding } from '../OnboardingContext';
import OnboardingStep from './OnboardingStep';

const OnboardingForm = ({
  schema,
  onSubmit,
  className,
  layout,
  getModel,
  autoFormProps,
}) => {
  const { handleNextStep, loan } = useOnboarding();
  const memoModel = useMemo(() => getModel(loan), []);
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
            model={memoModel}
            onSubmit={onSubmit}
            onSubmitSuccess={handleNextStep}
            submitFieldProps={{
              label: <T id="general.next" />,
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
