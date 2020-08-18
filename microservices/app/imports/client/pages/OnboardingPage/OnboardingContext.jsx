import React, { useContext, useEffect, useState } from 'react';
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
  const [showDrawer, setShowDrawer] = useState(false);

  const handleNextStep = (delay = 200) => {
    if (activeStep !== 'result') {
      setLatestStep(nextStepId);
      setTimeout(() => {
        setActiveStep(nextStepId);
      }, delay); // Make transitions smoother when possible with a little delay
    }
  };

  const resetPosition = () => {
    setActiveStep(latestStep);
  };

  useEffect(() => {
    // Reset drawer state when changing window width
    setShowDrawer(false);
  }, [isMobile]);

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
        showDrawer,
        setShowDrawer,
      }}
    >
      <Component />
    </Context.Provider>
  );
};

export default withOnboardingContext;
