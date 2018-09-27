// @flow
import React from 'react';

import Table from 'core/components/Table';
import MyLoansTableContainer from './MyLoansTableContainer';

type MyLoansTableProps = {};

const MyLoansTable = ({ columnOptions, rows }: MyLoansTableProps) => (
  <Table
    columnOptions={columnOptions}
    rows={rows}
    clickable
    noIntl
    // tableFilters={{
    //   filters: {},
    //   options: {},
    // }}
  />
);

export default MyLoansTableContainer(MyLoansTable);
