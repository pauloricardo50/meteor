import React from 'react';

import T from 'core/components/Translation';
import { AUCTION_STATUS } from 'core/api/constants';

export const columnOptions = [
  { id: 'InterestsTable.duration', style: { textAlign: 'center' } },
  { id: 'InterestsTable.rate', style: { textAlign: 'center' } },
];

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

// get interestRates from offers array
export const getInterestRatesFromOffers = ({ offers }) => [];

export const rows = ({ interestRates }) => formatInterestRates(interestRates);

export const checkForCompletedAuction = ({ loans }) =>
  loans.some(loan => loan.logic.auction.status === AUCTION_STATUS.ENDED);
