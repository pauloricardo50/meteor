import React from 'react';

import OnboardingContent from './OnboardingContent';
import withOnboardingContext from './OnboardingContext';
import OnboardingMarketing from './OnboardingMarketing';
import OnboardingStepper from './OnboardingStepper';

const OnboardingWithLoan = () => (
  <div className="onboarding">
    <OnboardingMarketing />

    <div className="onboarding-main">
      <OnboardingStepper />
      <OnboardingContent />
      {/* <OnboardingRecap /> */}
    </div>
  </div>
);

export default withOnboardingContext(OnboardingWithLoan);
