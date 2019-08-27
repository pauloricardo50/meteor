// @flow
import React from 'react';

import Table from 'core/components/Table';
import ReferredCustomersTableContainer from './ReferredCustomersTableContainer';

type ReferredCustomersTableProps = {};

const ReferredCustomersTable = ({
  rows,
  columnOptions,
}: ReferredCustomersTableProps) => (
  <Table rows={rows} columnOptions={columnOptions} />
);

export default ReferredCustomersTableContainer(ReferredCustomersTable);
