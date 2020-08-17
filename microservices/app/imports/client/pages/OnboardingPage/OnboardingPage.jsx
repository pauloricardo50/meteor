import React from 'react';

import OnboardingContent from './OnboardingContent';
import withOnboardingContext from './OnboardingContext';
import OnboardingMarketing from './OnboardingMarketing';
import OnboardingRecap from './OnboardingRecap';
import OnboardingStepper from './OnboardingStepper';
import OnboardingWithoutLoan from './OnboardingWithoutLoan';

const OnboardingPage = ({ hasLoan }) => {
  if (!hasLoan) {
    return <OnboardingWithoutLoan />;
  }

  return (
    <div className="onboarding">
      <OnboardingMarketing />

      <div className="onboarding-main">
        <OnboardingStepper />
        <OnboardingContent />
        {/* <OnboardingRecap /> */}
      </div>
    </div>
  );
};

export default withOnboardingContext(OnboardingPage);
