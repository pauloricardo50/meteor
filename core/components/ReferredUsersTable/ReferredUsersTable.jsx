// @flow
import React from 'react';

import Table from '../Table';
import Select from '../Select';
import ReferredUsersTableContainer from './ReferredUsersTableContainer';

type ReferredCustomersTableProps = {};

const ReferredUsersTable = ({
  rows,
  columnOptions,
  organisationId,
  name: organisationName,
  users,
  referredByUserId,
  setReferredByUserId,
}: ReferredCustomersTableProps) => (
    <>
      <h2>{rows.length} Utilisateurs</h2>
      <div>
        <Select
          label="Référé par"
          value={referredByUserId}
          onChange={setReferredByUserId}
          options={[
            { id: true, label: 'Tous' },
            { id: organisationId, label: organisationName },
            ...users.map(({ _id, name }) => ({ id: _id, label: name })),
          ]}
          className="mr-8"
        />
      </div>
      <Table rows={rows} columnOptions={columnOptions} />
    </>
  );

export default ReferredUsersTableContainer(ReferredUsersTable);
