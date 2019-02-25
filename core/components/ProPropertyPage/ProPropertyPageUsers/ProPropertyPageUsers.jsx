// @flow
import React from 'react';
import Table from 'core/components/Table';
import ProPropertyPageUsersContainer from './ProPropertyPageUsersContainer';

type ProPropertyPageUsersProps = {};

const ProPropertyPageUsers = ({
  property,
  rows,
  columnOptions,
}: ProPropertyPageUsersProps) => (
  <div className="card1 card-top">
    <h2>Utilisateurs</h2>
    <Table rows={rows} columnOptions={columnOptions} />
  </div>
);

export default ProPropertyPageUsersContainer(ProPropertyPageUsers);
