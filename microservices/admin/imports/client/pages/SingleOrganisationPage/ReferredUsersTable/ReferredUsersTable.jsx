// @flow
import React from 'react';

import Table from 'core/components/Table';
import ReferredUsersTableContainer from './ReferredUsersTableContainer';

type ReferredUsersTableProps = {};

const ReferredUsersTable = ({
  rows,
  columnOptions,
}: ReferredUsersTableProps) => (
  <Table columnOptions={columnOptions} rows={rows} clickable />
);

export default ReferredUsersTableContainer(ReferredUsersTable);
