// @flow
import React from 'react';

import Table from 'core/components/Table';
import Select from 'core/components/Select';
import T from 'core/components/Translation';
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
  setWithAnonymous,
  referredByMe,
  setReferredByMe,
  proUser,
}: ProCustomersTableProps) => (
  <>
    <div>
      <MongoSelect
        value={status}
        onChange={setStatus}
        options={LOAN_STATUS}
        id="status"
        label={<T id="Forms.status" />}
        className="mr-8"
      />
      <Select
        label="Anonymes"
        value={withAnonymous}
        onChange={setWithAnonymous}
        options={[
          { id: true, label: 'Avec' },
          { id: false, label: 'Sans' },
        ]}
        className="mr-8"
      />
      <Select
        label="Référé par"
        value={referredByMe}
        onChange={setReferredByMe}
        options={[
          { id: true, label: 'Moi' },
          { id: false, label: 'Tous' },
        ]}
        className="mr-8"
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
