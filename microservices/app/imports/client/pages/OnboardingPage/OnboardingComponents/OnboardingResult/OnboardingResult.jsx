import React from 'react';
import CountUp from 'react-countup';

import { RESIDENCE_TYPE } from 'core/api/properties/propertyConstants';
import T from 'core/components/Translation';

import { useOnboarding } from '../../OnboardingContext';
import OnboardingResultCtas from './OnboardingResultCtas';
import OnboardingResultEmpty from './OnboardingResultEmpty';
import OnboardingResultOffers from './OnboardingResultOffers';

const OnboardingResult = () => {
  const { loan } = useOnboarding();
  const { residenceType, maxPropertyValue } = loan;

  if (!maxPropertyValue?.date) {
    return <OnboardingResultEmpty />;
  }

  const value =
    residenceType === RESIDENCE_TYPE.MAIN_RESIDENCE
      ? maxPropertyValue?.main.max.propertyValue
      : maxPropertyValue?.second.max.propertyValue;
  // const loan =

  return (
    <div className="onboarding-result">
      <img src="/img/logo_square_black.svg" alt="e-Potek" className="logo" />
      <h1 className="flex center-align">
        <T id="OnboardingResult.title" />
      </h1>

      <h2>
        <T id={`OnboardingResult.${loan.purchaseType}.title`} />
      </h2>
      <p className="secondary mt-0">
        <T id={`OnboardingResult.${loan.purchaseType}.subtitle`} />
      </p>

      <div className="onboarding-result-value">
        <CountUp
          end={value}
          className="recap-value text-center animated fadeIn"
          duration={1}
          prefix="CHF "
          preserveValue
          separator=" "
        />
      </div>

      {!loan.hasPromotion && (
        <>
          <h2>
            <T id="OnboardingResultOffers.title" />
          </h2>
          <p className="secondary mt-0">
            <T id="OnboardingResultOffers.subtitle" />
          </p>
        </>
      )}

      <OnboardingResultOffers />

      <OnboardingResultCtas />
    </div>
  );
};

export default OnboardingResult;
