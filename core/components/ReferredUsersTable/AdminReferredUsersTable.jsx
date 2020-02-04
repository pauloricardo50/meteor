//      
import React from 'react';
import ReferredUsersTable from './ReferredUsersTable';

                                       

const AdminReferredUsersTable = (props                              ) => (
    <ReferredUsersTable
        {...props}
        fixedOrganisationId={props.organisationId}
        ownReferredUsers={false}
    />
);

export default AdminReferredUsersTable;
