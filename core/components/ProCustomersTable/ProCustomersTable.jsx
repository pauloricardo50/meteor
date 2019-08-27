// @flow
import React from 'react';

import Table from 'core/components/Table';
import Select from 'core/components/Select';
import MongoSelect from 'core/components/Select/MongoSelect';
import { LOAN_STATUS } from 'core/api/constants';
import ProCustomersTableContainer from './ProCustomersTableContainer';

type ProCustomersTableProps = {};

const ProCustomersTable = ({
  rows,
  columnOptions,
  status,
  setStatus,
  withAnonymous,
  setWithAnonymous
}: ProCustomersTableProps) => (
  <>
    <div>
      <MongoSelect
        value={status}
        onChange={setStatus}
        options={LOAN_STATUS}
        id="status"
        label="Statut"
        className="table-filter mr-8"
      />
      <Select
        label="Anonymes"
        value={withAnonymous}
        onChange={(_, v) => setWithAnonymous(v)}
        options={[{ id: true, label: 'Avec' }, { id: false, label: 'Sans' }]}
      />
    </div>
    <Table
      className="pro-customers"
      rows={rows}
      columnOptions={columnOptions}
      clickable={false}
    />
  </>
);

export default ProCustomersTableContainer(ProCustomersTable);
