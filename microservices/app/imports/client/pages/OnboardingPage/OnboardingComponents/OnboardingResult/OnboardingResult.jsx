import React, { useEffect } from 'react';

import MaxPropertyValueResultsTable from 'core/components/MaxPropertyValue/MaxPropertyValueResultsTable';
import T from 'core/components/Translation';

import { useOnboarding } from '../../OnboardingContext';
import OnboardingResultCtas from './OnboardingResultCtas';
import OnboardingResultEmpty from './OnboardingResultEmpty';
import OnboardingResultOffers from './OnboardingResultOffers';

const OnboardingResult = () => {
  const { loan, steps, resetPosition } = useOnboarding();
  const { maxPropertyValue } = loan;

  const allAreDone = steps.every(({ done }) => done);

  useEffect(() => {
    // Automatically route to any step that needs to be done if you reach
    // the result step before, somehow
    if (!allAreDone) {
      // resetPosition();
    }
  }, [allAreDone]);

  if (!maxPropertyValue?.date) {
    return <OnboardingResultEmpty />;
  }

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

      <div className="onboarding-result-max-property-value max-property-value-results-table">
        <MaxPropertyValueResultsTable
          loan={loan}
          showMoreProps={{ primary: true }}
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
