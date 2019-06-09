// @flow
import React from 'react';

import Table from 'core/components/Table';
import ProCustomersTableContainer from './ProCustomersTableContainer';

type ProCustomersTableProps = {};

const ProCustomersTable = ({ rows, columnOptions }: ProCustomersTableProps) => (
  <Table
    className="pro-customers"
    rows={rows}
    columnOptions={columnOptions}
    clickable={false}
  />
);

export default ProCustomersTableContainer(ProCustomersTable);
