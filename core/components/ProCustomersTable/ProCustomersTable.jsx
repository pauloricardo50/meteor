import React from 'react';

import { LOAN_STATUS } from '../../api/loans/loanConstants';
import Select from '../Select';
import MongoSelect from '../Select/MongoSelect';
import Table from '../Table';
import T from '../Translation';
import ProCustomersTableContainer from './ProCustomersTableContainer';

const ProCustomersTable = ({
  rows,
  columnOptions,
  status,
  setStatus,
  withAnonymous,
  setWithAnonymous,
  referredByMe,
  setReferredByMe,
}) => (
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
