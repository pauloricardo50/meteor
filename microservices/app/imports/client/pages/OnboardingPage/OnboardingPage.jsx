import React from 'react';

import OnboardingWithLoan from './OnboardingWithLoan';
import OnboardingWithoutLoan from './OnboardingWithoutLoan';

const OnboardingPage = ({ loan }) => {
  console.log('loan:', loan);
  if (!loan) {
    return <OnboardingWithoutLoan />;
  }

  return <OnboardingWithLoan loan={loan} />;
};

export default OnboardingPage;
