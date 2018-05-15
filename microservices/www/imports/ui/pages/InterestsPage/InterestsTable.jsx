import React from 'react';

import Table from 'core/components/Table';
import { T } from 'core/components/Translation';
import interestRates from './interestRates';
import InterestsTableTrend from './InterestsTableTrend';

const columnOptions = [
  { id: 'InterestsTable.duration', style: { textAlign: 'center' } },
  { id: 'InterestsTable.trend', style: { textAlign: 'center', paddingLeft: 0, paddingRight: 0 } },
  { id: 'InterestsTable.rate', style: { textAlign: 'center' } },
];

const formatRate = rate => (
  <span>
    <b>{(rate * 100).toFixed(2)}</b>
    <span>%</span>
  </span>
);

const rows = interestRates.map(({ type, rateLow, rateHigh, trend }) => ({
  id: type,
  columns: [
    <T id={`InterestsTable.${type}`} />,
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
