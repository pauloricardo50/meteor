import React, { useContext, useState } from 'react';
import { StringParam, useQueryParam } from 'use-query-params';

import useMedia from 'core/hooks/useMedia';

import { getSteps } from './onboardingHelpers';

const Context = React.createContext();

export const useOnboarding = () => useContext(Context);

const getCurrentTodoStep = steps => steps.find(({ done }) => !done).id;

const withOnboardingContext = Component => ({ loan }) => {
  const steps = getSteps(loan).map(step => ({
    ...step,
    done: step.isDone(loan),
  }));
  const stepIds = steps.map(({ id }) => id);
  const currentTodoStep = getCurrentTodoStep(steps);
  const [activeStep = currentTodoStep, setActiveStep] = useQueryParam(
    'step',
    StringParam,
  );
  const [latestStep, setLatestStep] = useState();
  const isMobile = useMedia({ maxWidth: 768 });
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
        steps,
        stepIds,
        loan,
        currentTodoStep,
      }}
    >
      <Component />
    </Context.Provider>
  );
};

export default withOnboardingContext;
