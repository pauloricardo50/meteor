import React from 'react';

import Table from '../Table';
import Select from '../Select';
import ReferredUsersTableContainer from './ReferredUsersTableContainer';

const ReferredUsersTable = ({
  rows,
  columnOptions,
  organisationId,
  name: organisationName,
  users = [],
  referredByUserId,
  setReferredByUserId,
}) => {
  const verified = rows.filter(({ user }) => user.emails[0].verified);
  return (
    <>
      <h2>
        <span>{rows.length} Utilisateurs</span>
        &nbsp;
        <small className="secondary">dont {verified.length} vérifiés</small>
      </h2>
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
};

export default ReferredUsersTableContainer(ReferredUsersTable);
