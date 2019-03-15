// @flow
import React from 'react';

import Table from '../Table';
import RevenuesByStatusContainer from './RevenuesByStatusContainer';

type RevenuesByStatusProps = {};

const RevenuesByStatus = ({ rows, columnOptions }: RevenuesByStatusProps) => (
  <Table rows={rows} columnOptions={columnOptions} />
);

export default RevenuesByStatusContainer(RevenuesByStatus);
