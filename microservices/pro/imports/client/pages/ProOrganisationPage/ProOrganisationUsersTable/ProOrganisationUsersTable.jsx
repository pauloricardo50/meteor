import React from 'react';

import ProOrganisationUserAdder from 'core/components/ProOrganisationUserAdder';
import Table from 'core/components/Table';

import ProOrganisationUsersTableContainer from './ProOrganisationUsersTableContainer';

const ProOrganisationUsersTable = ({
  rows,
  columnOptions,
  currentUser,
  name,
  _id: organisationId,
}) => (
  <>
    <ProOrganisationUserAdder
      organisationId={organisationId}
      organisationName={name}
      buttonProps={{ label: 'Inviter un collègue' }}
    />
    <Table rows={rows} columnOptions={columnOptions} />
  </>
);

export default ProOrganisationUsersTableContainer(ProOrganisationUsersTable);
