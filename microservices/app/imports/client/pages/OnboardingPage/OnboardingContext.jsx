import React, { useContext, useMemo, useState } from 'react';

import useMedia from 'core/hooks/useMedia';

import { getStepIds } from './onboardingHelpers';

const Context = React.createContext();

export const useOnboarding = () => useContext(Context);

const getInitialStep = () => 'purchaseType';

const withOnboardingContext = Component => props => {
  const [activeStep, setActiveStep] = useState(() => getInitialStep(props));
  const isMobile = useMedia({ maxWidth: 768 });
  const stepIds = useMemo(() => getStepIds(props.loan), [props.loan._id]);

  return (
    <Context.Provider value={{ activeStep, setActiveStep, isMobile, stepIds }}>
      <Component {...props} />
    </Context.Provider>
  );
};

export default withOnboardingContext;
