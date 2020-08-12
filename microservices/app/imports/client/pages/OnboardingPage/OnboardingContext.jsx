import React, { useContext, useMemo, useState } from 'react';
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
  const [latestStep, setLatestStep] = useState();
  const isMobile = useMedia({ maxWidth: 768 });
  const stepIds = useMemo(() => getStepIds(props.loan), [props.loan._id]);
  const nextStepId = stepIds[stepIds.findIndex(id => id === activeStep) + 1];
  const handleNextStep = () => {
    if (activeStep !== 'result') {
      setLatestStep(nextStepId);
      setTimeout(() => {
        setActiveStep(nextStepId);
      }, 200); // Allow ripple to show fully
    }
  };
  const resetPosition = () => {
    setActiveStep(latestStep);
  };

  return (
    <Context.Provider
      value={{
        activeStep,
        handleNextStep,
        isMobile,
        resetPosition,
        setActiveStep,
        stepIds,
      }}
    >
      <Component {...props} />
    </Context.Provider>
  );
};

export default withOnboardingContext;
