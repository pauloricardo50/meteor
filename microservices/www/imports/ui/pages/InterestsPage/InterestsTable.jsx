import React from 'react';

import Table from 'core/components/Table';
import { T } from 'core/components/Translation';
import interestRates from './interestRates';
import InterestsTableTrend from './InterestsTableTrend';

const columnOptions = [
  { id: 'InterestsTable.duration' },
  { id: 'InterestsTable.trend' },
  { id: 'InterestsTable.rate' },
];

const formatRate = rate => (rate * 100).toFixed(2);

const rows = interestRates.map(({ type, rateLow, rateHigh, trend }) => ({
  id: type,
  columns: [
    <T id={`offer.${type}`} />,
    <InterestsTableTrend trend={trend} />,
    <span>
      {formatRate(rateLow)} - {formatRate(rateHigh)}
    </span>,
  ],
}));

const InterestsTable = () => (
  <div className="interests-page-table">
    <Table columnOptions={columnOptions} rows={rows} sortable={false} />
  </div>
);

export default InterestsTable;
