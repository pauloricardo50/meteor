import React, { useContext, useEffect, useState } from 'react';
import { StringParam, useQueryParam } from 'use-query-params';

import useMedia from 'core/hooks/useMedia';

import { getOnBoardingFlow, getSteps } from './onboardingHelpers';

const Context = React.createContext();

export const useOnboarding = () => useContext(Context);

const getCurrentTodoStep = steps =>
  steps.find(({ done }) => !done)?.id || 'result';

export const getNextStepId = steps => {
  const nextStep = steps.find(({ done }) => !done);

  return nextStep?.id || 'result';
};

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
  const [waitForStepDone, setWaitForStepDone] = useState();
  const isMobile = useMedia({ maxWidth: 768 });
  const nextStepId = getNextStepId(steps, activeStep);
  const [showDrawer, setShowDrawer] = useState(false);

  const handleNextStep = () => {
    if (activeStep !== 'result') {
      setWaitForStepDone(activeStep);
    }
  };

  useEffect(() => {
    // This mechanic avoids race conditions in the onboarding, as we're waiting
    // for the loan subscription to come back from the server with updated data,
    // this waits for the loan to have the right state before going to the next
    // step
    if (waitForStepDone) {
      const isStepDone = steps.find(({ id }) => id === waitForStepDone)?.done;

      if (isStepDone) {
        setActiveStep(nextStepId);
        setWaitForStepDone(null);
      }
    }
  });

  const resetPosition = () => {
    setActiveStep(currentTodoStep);
  };

  useEffect(() => {
    // Reset drawer state when changing window width, to avoid invalid UI states
    setShowDrawer(false);
  }, [isMobile]);

  useEffect(() => {
    // Make sure the user never lands on a step that is outside of his flow
    if (!stepIds.includes(activeStep)) {
      resetPosition();
    }
  });

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
        flow: getOnBoardingFlow(loan),
      }}
    >
      <Component />
    </Context.Provider>
  );
};

export default withOnboardingContext;
