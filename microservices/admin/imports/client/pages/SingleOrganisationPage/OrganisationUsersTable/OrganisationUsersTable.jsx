import React from 'react';

import ProOrganisationUserAdder from 'core/components/ProOrganisationUserAdder';
import Table from 'core/components/Table';

import OrganisationUserAdder from '../OrganisationUserAdder/OrganisationUserAdder';
import OrganisationUsersTableContainer from './OrganisationUsersTableContainer';

const OrganisationUsersTable = ({ rows, columnOptions, ...organisation }) => (
  <div>
    <div className="flex-row space-children" style={{ alignItems: 'center' }}>
      <OrganisationUserAdder organisation={organisation} />
      <ProOrganisationUserAdder
        organisationId={organisation._id}
        organisationName={organisation.name}
      />
    </div>
    <Table columnOptions={columnOptions} rows={rows} clickable />
  </div>
);

export default OrganisationUsersTableContainer(OrganisationUsersTable);
