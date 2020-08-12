import React from 'react';
import CountUp from 'react-countup';

import { RESIDENCE_TYPE } from 'core/api/properties/propertyConstants';
import T from 'core/components/Translation';

import { useOnboarding } from '../../OnboardingContext';
import OnboardingResultCtas from './OnboardingResultCtas';
import OnboardingResultOffers from './OnboardingResultOffers';

const OnboardingResult = () => {
  const { loan } = useOnboarding();
  const { residenceType, maxPropertyValue } = loan;

  const value =
    residenceType === RESIDENCE_TYPE.MAIN_RESIDENCE
      ? maxPropertyValue?.main.max
      : maxPropertyValue?.second.max;

  return (
    <div className="onboarding-result">
      <h1 className="text-center">
        <T id="OnboardingResult.title" />
        <br />
        <small className="secondary">
          <T id="OnboardingResult.subtitle" />
        </small>
      </h1>

      <div className="onboarding-result-value">
        <CountUp
          end={value || 1000000}
          className="recap-value text-center animated fadeIn"
          duration={1}
          prefix="CHF "
          preserveValue
          separator=" "
        />
      </div>

      <p>
        <T id="OnboardingResult.description" />
      </p>

      <OnboardingResultOffers />

      <OnboardingResultCtas />
    </div>
  );
};
export default OnboardingResult;
