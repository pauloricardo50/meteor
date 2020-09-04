import React from 'react';

import OnboardingContent from './OnboardingContent';
import withOnboardingContext from './OnboardingContext';
import OnboardingMobileStepper from './OnboardingMobileStepper';
import OnboardingSideNav from './OnboardingSideNav';

const OnboardingWithLoan = () => (
  <div className="onboarding">
    <OnboardingSideNav />
    <OnboardingMobileStepper />
    <OnboardingContent />
  </div>
);

export default withOnboardingContext(OnboardingWithLoan);
