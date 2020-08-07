import React from 'react';

import OnboardingContent from './OnboardingContent';
import withOnboardingContext from './OnboardingContext';
import OnboardingMarketing from './OnboardingMarketing';
import OnboardingRecap from './OnboardingRecap';
import OnboardingStepper from './OnboardingStepper';

const OnboardingPage = ({ loan }) => (
  <div className="onboarding">
    <OnboardingMarketing />

    <div className="onboarding-main">
      <OnboardingStepper />
      <OnboardingContent />
      <OnboardingRecap />
    </div>
  </div>
);

export default withOnboardingContext(OnboardingPage);
