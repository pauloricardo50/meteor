// @flow
import React from 'react';
import Table from 'core/components/Table';
import ProPropertyPageUsersContainer from './ProPropertyPageUsersContainer';
import ProPropertyProUserAdder from './ProPropertyProUserAdder/ProPropertyProUserAdder';

type ProPropertyPageUsersProps = {};

const ProPropertyPageUsers = ({
  property,
  rows,
  columnOptions,
  permissions,
}: ProPropertyPageUsersProps) => (
  <div className="card1 card-top users-table">
    <span className="flex users-table-header">
      <h2>Utilisateurs</h2>
      {permissions.canInviteProUsers && (
        <ProPropertyProUserAdder property={property} />
      )}
    </span>
    <Table rows={rows} columnOptions={columnOptions} />
  </div>
);

export default ProPropertyPageUsersContainer(ProPropertyPageUsers);
