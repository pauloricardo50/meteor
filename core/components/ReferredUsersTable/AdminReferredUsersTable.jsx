// @flow
import React from 'react';
import ReferredUsersTable from './ReferredUsersTable';

type AdminReferredUsersTableProps = {};

const AdminReferredUsersTable = (props: AdminReferredUsersTableProps) => (
    <ReferredUsersTable
        {...props}
        fixedOrganisationId={props.organisationId}
        ownReferredUsers={false}
    />
);

export default AdminReferredUsersTable;
