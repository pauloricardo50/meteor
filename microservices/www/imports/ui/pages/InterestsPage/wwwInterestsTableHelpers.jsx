import React from 'react';

import T from 'core/components/Translation';
import InterestsTableTrend from 'core/components/InterestRatesTable/InterestsTableTrend';

export const columnOptions = [
  { id: 'InterestsTable.duration', style: { textAlign: 'center' } },
  {
    id: 'InterestsTable.trend',
    style: { textAlign: 'center', paddingLeft: 0, paddingRight: 0 },
  },
  { id: 'InterestsTable.rate', style: { textAlign: 'center' } },
];

export const formatRate = rate => (
  <span>
    <b>{(rate * 100).toFixed(2)}</b>
    <span>%</span>
  </span>
);

export const rows = interestRates =>
  interestRates.map(({ type, rateLow, rateHigh, trend }) => ({
    id: type,
    columns: [
      <T id={`InterestsTable.${type}`} key={1} />,
      <InterestsTableTrend trend={trend} key={2} />,
      <span key={3}>
        {formatRate(rateLow)} - {formatRate(rateHigh)}
      </span>,
    ],
  }));
