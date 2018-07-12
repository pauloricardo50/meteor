import React from 'react';

import T from 'core/components/Translation';
import interestRates from 'core/components/InterestRatesTable/interestRates';

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

export const rows = interestRates.map(({ type, rateLow, rateHigh }) => ({
  id: type,
  columns: [
    <T id={`InterestsTable.${type}`} />,
    <span>
      {formatRate(rateLow)} - {formatRate(rateHigh)}
    </span>,
  ],
}));
