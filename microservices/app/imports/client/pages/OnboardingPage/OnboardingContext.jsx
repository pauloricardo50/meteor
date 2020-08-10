import React, { useContext, useMemo } from 'react';
import { StringParam, useQueryParam } from 'use-query-params';

import useMedia from 'core/hooks/useMedia';

import { getStepIds } from './onboardingHelpers';

const Context = React.createContext();

export const useOnboarding = () => useContext(Context);

const getInitialStep = () => 'purchaseType';

const withOnboardingContext = Component => props => {
  const [activeStep = 'purchaseType', setActiveStep] = useQueryParam(
    'activeStep',
    StringParam,
  );
  const isMobile = useMedia({ maxWidth: 768 });
  const stepIds = useMemo(() => getStepIds(props.loan), [props.loan._id]);
  const nextStepId = stepIds[stepIds.findIndex(id => id === activeStep) + 1];
  const handleNextStep = () => {
    if (activeStep !== 'result') {
      setTimeout(() => {
        setActiveStep(nextStepId);
      }, 200); // Allow ripple to show fully
    }
  };

  return (
    <Context.Provider
      value={{ activeStep, setActiveStep, isMobile, stepIds, handleNextStep }}
    >
      <Component {...props} />
    </Context.Provider>
  );
};

export default withOnboardingContext;
