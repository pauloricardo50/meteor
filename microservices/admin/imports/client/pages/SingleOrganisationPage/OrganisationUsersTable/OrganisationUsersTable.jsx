// @flow
import React from 'react';

import Table from 'core/components/Table';
import OrganisationUsersTableContainer from './OrganisationUsersTableContainer';
import OrganisationUserAdder from '../OrganisationUserAdder/OrganisationUserAdder';

type OrganisationUsersTableProps = {
  rows: Array<Object>,
  columnOptions: Array<Object>,
  organisation: Object,
};

const OrganisationUsersTable = ({
  rows,
  columnOptions,
  organisation,
}: OrganisationUsersTableProps) => (
  <div>
    <OrganisationUserAdder organisation={organisation} />
    <Table columnOptions={columnOptions} rows={rows} clickable />
  </div>
);

export default OrganisationUsersTableContainer(OrganisationUsersTable);
