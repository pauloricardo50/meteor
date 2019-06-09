import React from 'react';

import T from 'core/components/Translation';
import { INTEREST_RATES } from 'core/api/constants';

export const columnOptions = [
  { id: 'InterestsTable.duration', style: { textAlign: 'center' } },
  { id: 'InterestsTable.rate', style: { textAlign: 'center' } },
];

export const interestRatesTableOptions = Object.values(INTEREST_RATES);

export const formatRate = rate => (
  <span>
    <b>{(rate * 100).toFixed(2)}</b>
    <span>%</span>
  </span>
);

export const formatInterestRates = interestRatesArray =>
  interestRatesArray
    .filter(({ rateLow }) => Number.isFinite(rateLow))
    .map(({ type, rateLow, rateHigh }) => ({
      id: type,
      columns: [
        <T id={`InterestsTable.${type}`} />,
        <span>
          {formatRate(rateLow)} - {formatRate(rateHigh)}
        </span>,
      ],
    }));

const getSameRatesFromOffers = (offers, interestKey) =>
  offers.reduce(
    (rates, offer) =>
      (offer[interestKey] ? [...rates, offer[interestKey]] : rates),
    [],
  );

export const getBestRate = (offers, interestKey) => {
  const rates = getSameRatesFromOffers(offers, interestKey);

  return { rateLow: Math.min(...rates), rateHigh: Math.max(...rates) };
};

export const getInterestRatesFromOffers = offers =>
  interestRatesTableOptions
    .map((interestKey) => {
      const rates = getBestRate(offers, interestKey);

      if (rates) {
        return { type: interestKey, ...rates };
      }

      return null;
    })
    .filter(interestRatesTableOption => interestRatesTableOption);
