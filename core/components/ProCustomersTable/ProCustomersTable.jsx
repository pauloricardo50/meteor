// @flow
import React from 'react';

import Table from 'core/components/Table';
import MongoSelect from 'core/components/Select/MongoSelect';
import { LOAN_STATUS } from 'core/api/constants';
import ProCustomersTableContainer from './ProCustomersTableContainer';

type ProCustomersTableProps = {};

const ProCustomersTable = ({
  rows,
  columnOptions,
  status,
  setStatus,
}: ProCustomersTableProps) => (
  <>
    <MongoSelect
      value={status}
      onChange={setStatus}
      options={LOAN_STATUS}
      id="status"
      label="Statut"
      className="table-filter"
    />
    <Table
      className="pro-customers"
      rows={rows}
      columnOptions={columnOptions}
      clickable={false}
    />
  </>
);

export default ProCustomersTableContainer(ProCustomersTable);
