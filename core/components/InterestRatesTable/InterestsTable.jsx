import React from 'react';

import Table from '../Table';
import { IntlDate } from '../Translation';

const InterestRatesTable = ({ columnOptions, rows, date }) => (
  <div className="interests-page-table">
    <Table columnOptions={columnOptions} rows={rows} sortable={false} />
    {date && (
      <small className="interests-table-date">
        <IntlDate value={date} />
      </small>
    )}
  </div>
);

export default InterestRatesTable;
