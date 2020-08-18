import React from 'react';

import OnboardingContent from './OnboardingContent';
import withOnboardingContext from './OnboardingContext';
import OnboardingStepper from './OnboardingStepper';

const OnboardingWithLoan = () => (
  <div className="onboarding">
    <div className="onboarding-main">
      <OnboardingStepper />
      <OnboardingContent />
    </div>
  </div>
);

export default withOnboardingContext(OnboardingWithLoan);
