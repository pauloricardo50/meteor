import React, { useMemo } from 'react';

import MaxPropertyValueCertificate from 'core/components/MaxPropertyValue/MaxPropertyValueCertificate';
import MaxPropertyValueResultsTable from 'core/components/MaxPropertyValue/MaxPropertyValueResultsTable';
import { parseMaxPropertyValue } from 'core/components/MaxPropertyValue/MaxPropertyValueResultsTable/maxPropertyValueHelpers';
import T from 'core/components/Translation';
import Calculator from 'core/utils/Calculator';

import { useOnboarding } from '../../OnboardingContext';
import { ONBOARDING_FLOWS } from '../../onboardingHelpers';
import OnboardingResultCtas, {
  OnboardingResultCtaDefault,
} from './OnboardingResultCtas';
import OnboardingResultEmpty from './OnboardingResultEmpty';
import OnboardingResultOffers from './OnboardingResultOffers';
import OnboardingResultUnfinished from './OnboardingResultUnfinished';

const getTitleId = (loan, flow, maxPropertyValue, raise) => {
  if (loan.hasPromotion) {
    return 'promotion';
  }

  if (flow === ONBOARDING_FLOWS.ACQUISITION_SEARCH) {
    return 'search';
  }

  if (flow === ONBOARDING_FLOWS.REFINANCING) {
    if (raise >= 0) {
      return 'refinancingRaise';
    }

    return 'refinancingAmortization';
  }

  const propertyValue = Calculator.selectPropertyValue({ loan });

  if (propertyValue > maxPropertyValue) {
    return 'propertyNegative';
  }

  return 'propertyPositive';
};

const OnboardingResult = () => {
  const { loan, steps, flow, isMobile } = useOnboarding();
  const { maxPropertyValue } = loan;

  if (steps.filter(({ id }) => id !== 'result').some(({ done }) => !done)) {
    return <OnboardingResultUnfinished />;
  }

  if (!maxPropertyValue?.date) {
    return <OnboardingResultEmpty />;
  }

  const { titleId } = useMemo(() => {
    const data = parseMaxPropertyValue(loan, true);
    return {
      titleId: getTitleId(loan, flow, data.maxPropertyValue, data.raise),
    };
  }, [maxPropertyValue.date]);

  return (
    <div className="onboarding-result">
      {isMobile ? (
        <div className="mt-16 mb-16 flex fe">
          <OnboardingResultCtaDefault loanId={loan._id} />
        </div>
      ) : null}

      <h1 className="flex center-align mt-0">
        <T id={`OnboardingResult.title.${titleId}`} />
      </h1>

      <p className="secondary mt-0">
        <T id={`OnboardingResult.subtitle.${titleId}`} />
      </p>

      <div className="onboarding-result-max-property-value max-property-value-results-table">
        <MaxPropertyValueResultsTable
          loan={loan}
          showMoreProps={{ primary: true }}
        />
        <MaxPropertyValueCertificate
          loan={loan}
          buttonProps={{ className: 'mt-16' }}
        />
      </div>

      {!loan.hasPromotion && (
        <h2>
          <T id="OnboardingResultOffers.title" />
        </h2>
      )}

      <OnboardingResultOffers />

      <OnboardingResultCtas />
    </div>
  );
};

export default OnboardingResult;
