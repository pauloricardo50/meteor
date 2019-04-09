import React from 'react';

import Table from 'core/components/Table';
import { IntlDate } from 'core/components/Translation';

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
