//      
import React from 'react';

import Table from 'core/components/Table';
import ProOrganisationUserAdder from 'core/components/ProOrganisationUserAdder';
import OrganisationUsersTableContainer from './OrganisationUsersTableContainer';
import OrganisationUserAdder from '../OrganisationUserAdder/OrganisationUserAdder';

                                    
                      
                               
  

const OrganisationUsersTable = ({
  rows,
  columnOptions,
  ...organisation
}                             ) => (
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
