// @flow
import React from 'react';

import Table from '../Table';
import RevenuesByStatusContainer from './RevenuesByStatusContainer';

type RevenuesByStatusProps = {};

const RevenuesByStatus = ({ rows, columnOptions }: RevenuesByStatusProps) => (
  <Table
    className="revenues-by-status"
    rows={rows}
    columnOptions={columnOptions}
    sortable={false}
  />
);

export default RevenuesByStatusContainer(RevenuesByStatus);
