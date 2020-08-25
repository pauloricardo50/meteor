import React, { useState } from 'react';

import { hasStartedOnboarding } from './onboardingHelpers';
import OnboardingWithLoan from './OnboardingWithLoan';
import OnboardingWithoutLoan from './OnboardingWithoutLoan';

const OnboardingPage = ({ loan }) => {
  const [hasSeenInitialScreen, setHasSeenInitialScreen] = useState(false);

  if (!loan) {
    return <OnboardingWithoutLoan />;
  }

  if (
    loan.hasPromotion &&
    !hasStartedOnboarding(loan) &&
    !hasSeenInitialScreen
  ) {
    return (
      <OnboardingWithoutLoan
        promotion={loan.promotions[0]}
        onStart={() => setHasSeenInitialScreen(true)}
      />
    );
  }

  return <OnboardingWithLoan loan={loan} />;
};

export default OnboardingPage;
