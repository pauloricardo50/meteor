// @flow
import React from 'react';

import Table from 'core/components/Table';
import ProOrganisationUsersTableContainer from './ProOrganisationUsersTableContainer';
import ProOrganisationUserAdder from './ProOrganisationUserAdder';

type ProOrganisationUsersTableProps = {};

const ProOrganisationUsersTable = ({
  rows,
  columnOptions,
  currentUser,
  name,
  _id: organisationId,
}: ProOrganisationUsersTableProps) => (
  <>
    <ProOrganisationUserAdder
      currentUser={currentUser}
      organisationId={organisationId}
      organisationName={name}
    />
    <Table rows={rows} columnOptions={columnOptions} />
  </>
);

export default ProOrganisationUsersTableContainer(ProOrganisationUsersTable);
