import React from 'react';

import { INTEREST_RATES } from 'core/api/interestRates/interestRatesConstants';
import { currentInterestRates } from 'core/api/interestRates/queries';
import T, { Percent } from 'core/components/Translation';
import useMeteorData from 'core/hooks/useMeteorData';

const ratesToShow = [
  INTEREST_RATES.LIBOR,
  INTEREST_RATES.YEARS_5,
  INTEREST_RATES.YEARS_10,
  INTEREST_RATES.YEARS_15,
];

const OnboardingResultOffers = () => {
  const { data } = useMeteorData({ query: currentInterestRates });

  if (!data?.rates) {
    return null;
  }

  return (
    <div className="onboarding-result-offers animated fadeIn">
      <div className="offers">
        {ratesToShow.map(rate => {
          const value = data.rates.find(({ type }) => type === rate);

          if (!value) {
            return null;
          }

          return (
            <div className="offer" key={rate}>
              <span className="secondary">
                <T id={`Forms.${rate}`} />
              </span>
              <br />
              <h4 className="m-0">
                <small>
                  <T id="OnboardingResultOffers.from" />
                </small>
                &nbsp;
                <Percent value={value.rateLow} />
              </h4>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OnboardingResultOffers;
