import React from 'react';

import T from 'core/components/Translation';
import { AUCTION_STATUS, INTEREST_RATES } from 'core/api/constants';

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

const formatInterestRates = interestRatesArray =>
  interestRatesArray.map(({ type, rateLow, rateHigh }) => ({
    id: type,
    columns: [
      <T id={`InterestsTable.${type}`} />,
      <span>
        {formatRate(rateLow)} - {formatRate(rateHigh)}
      </span>,
    ],
  }));

const getMinimumRate = ({ min, firstValue, secondValue }) => {
  if (min > firstValue) {
    min = firstValue;
  }

  if (min > secondValue) {
    min = secondValue;
  }

  return min;
};

const getMaximumRate = ({ max, firstValue, secondValue }) => {
  if (max < firstValue) {
    max = firstValue;
  }

  if (max < secondValue) {
    max = secondValue;
  }

  return max;
};

const getBestRate = ({ offers, interestKey }) => {
  let min = 1;
  let max = 0;

  offers.forEach(({ standardOffer, counterpartOffer }) => {
    min = getMinimumRate({
      min,
      firstValue: standardOffer[interestKey],
      secondValue: counterpartOffer[interestKey],
    });

    max = getMaximumRate({
      max,
      firstValue: standardOffer[interestKey],
      secondValue: counterpartOffer[interestKey],
    });
  });

  if (min === 1 || max === 0) {
    return null;
  }

  return { rateLow: min, rateHigh: max };
};

export const getBestRatesInAllOffers = ({ offers }) =>
  interestRatesTableOptions
    .map((interestKey) => {
      const rates = getBestRate({ offers, interestKey });

      if (rates) {
        return { type: interestKey, ...rates };
      }

      return null;
    })
    .filter(interestRatesTableOption => interestRatesTableOption);

export const rows = ({ interestRates }) => formatInterestRates(interestRates);

export const checkForCompletedAuction = ({ loans }) =>
  loans.some(loan => loan.logic.auction.status === AUCTION_STATUS.ENDED);
