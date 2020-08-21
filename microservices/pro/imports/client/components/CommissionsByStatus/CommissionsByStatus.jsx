import React from 'react';

import Table from 'core/components/Table';

import CommissionsByStatusContainer from './CommissionsByStatusContainer';

const CommissionsByStatus = ({ rows, columnOptions }) => (
  <Table
    className="commissions-by-status"
    rows={rows}
    columnOptions={columnOptions}
    sortable={false}
  />
);

export default CommissionsByStatusContainer(CommissionsByStatus);
