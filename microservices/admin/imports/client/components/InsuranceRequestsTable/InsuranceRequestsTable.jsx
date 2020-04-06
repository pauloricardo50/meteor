import React from 'react';

import Table, { ORDER } from 'core/components/Table';
import InsuranceRequestsTableContainer from './InsuranceRequestsTableContainer';

const InsuranceRequestsTable = ({ columnOptions, rows }) => (
  <Table
    columnOptions={columnOptions}
    rows={rows}
    noIntl
    clickable
    initialOrder={ORDER.DESC}
  />
);

export default InsuranceRequestsTableContainer(InsuranceRequestsTable);
