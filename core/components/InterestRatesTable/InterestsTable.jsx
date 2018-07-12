import React from 'react';

import Table from 'core/components/Table';
import InterestsTableDate from './InterestsTableDate';

const InterestRatesTable = ({ columnOptions, rows }) => (
  <div className="interests-page-table">
    <Table columnOptions={columnOptions} rows={rows} sortable={false} />
    <InterestsTableDate />
  </div>
);

export default InterestRatesTable;
