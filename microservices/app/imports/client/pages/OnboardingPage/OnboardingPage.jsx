import React, { useEffect, useState } from 'react';

import { analyticsStartedOnboarding } from 'core/api/analytics/methodDefinitions';
import { loanUpdate } from 'core/api/loans/methodDefinitions';

import OnboardingWithLoan from './OnboardingWithLoan';
import OnboardingWithoutLoan from './OnboardingWithoutLoan';

const OnboardingPage = ({ loan }) => {
  const [hasSeenInitialScreen, setHasSeenInitialScreen] = useState(
    !!loan?.hasStartedOnboarding,
  );

  useEffect(() => {
    if (loan && !loan.hasStartedOnboarding) {
      analyticsStartedOnboarding.run({ loanId: loan._id });
    }
  }, []);

  if (!loan) {
    return <OnboardingWithoutLoan />;
  }

  if (!hasSeenInitialScreen) {
    return (
      <OnboardingWithoutLoan
        promotion={loan.promotions[0]}
        onStart={purchaseType => {
          if (purchaseType) {
            loanUpdate
              .run({ loanId: loan._id, object: { purchaseType } })
              .then(() => setHasSeenInitialScreen(true));
          } else {
            setHasSeenInitialScreen(true);
          }
        }}
        loanId={loan._id}
      />
    );
  }

  return <OnboardingWithLoan loan={loan} />;
};

export default OnboardingPage;
