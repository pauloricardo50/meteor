// @flow
import React from 'react';

import Table, { ORDER } from 'core/components/Table';
import MyLoansTableContainer from './MyLoansTableContainer';

type MyLoansTableProps = {};

const MyLoansTable = ({ columnOptions, rows }: MyLoansTableProps) => (
  <Table
    columnOptions={columnOptions}
    rows={rows}
    clickable
    noIntl
    initialOrder={ORDER.DESC}
  />
);

export default MyLoansTableContainer(MyLoansTable);
