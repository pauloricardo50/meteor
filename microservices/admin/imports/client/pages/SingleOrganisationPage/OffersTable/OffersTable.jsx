// @flow
import React from 'react';
import Table from 'core/components/Table';
import OffersTableContainer from './OffersTableContainer';

type OffersTableProps = {
  rows: Array<Object>,
  columnOptions: Array<Object>,
};

const OffersTable = ({ rows, columnOptions }: OffersTableProps) => (
  <Table columnOptions={columnOptions} rows={rows} clickable />
);

export default OffersTableContainer(OffersTable);
