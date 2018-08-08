import React from 'react';

import T from 'core/components/Translation/';
import { ROLES } from 'core/api/constants';
import adminsQuery from 'core/api/users/queries/admins';
import UsersTable from './UsersTable';

const getAdminsEmails = async () => {
  const admins = await adminsQuery.clone().fetchSync();
  const adminsEmails = admins.map(({ emails: [{ address }] }) => address);
  return [...adminsEmails, undefined];
};

const usersTableFilters = {
  filters: {
    roles: true,
    assignedEmployee: { emails: [{ address: true }] },
  },
  options: {
    roles: Object.values(ROLES),
    address: getAdminsEmails(),
  },
};

const UsersPage = ({ history }) => (
  <section className="card1 card-top users-page">
    <h1>
      <T id="collections.users" />
    </h1>
    <UsersTable
      showAssignee
      key="allUsers"
      history={history}
      tableFilters={usersTableFilters}
    />
  </section>
);

export default UsersPage;
