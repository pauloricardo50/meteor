//
import React from 'react';

import Table from '../Table';
import RevenuesByStatusContainer from './RevenuesByStatusContainer';

const RevenuesByStatus = ({ rows, columnOptions }) => (
  <Table
    className="revenues-by-status"
    rows={rows}
    columnOptions={columnOptions}
    sortable={false}
  />
);

export default RevenuesByStatusContainer(RevenuesByStatus);
