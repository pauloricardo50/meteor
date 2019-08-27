// @flow
import React from 'react';

import Table from 'core/components/Table';
import ProOrganisationUserAdder from 'core/components/ProOrganisationUserAdder';
import ProOrganisationUsersTableContainer from './ProOrganisationUsersTableContainer';

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
      organisationId={organisationId}
      organisationName={name}
    />
    <Table rows={rows} columnOptions={columnOptions} />
  </>
);

export default ProOrganisationUsersTableContainer(ProOrganisationUsersTable);
