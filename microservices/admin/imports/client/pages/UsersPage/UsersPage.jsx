import React from 'react';

import T from 'core/components/Translation/';
import { ROLES } from 'core/api/constants';
import adminsQuery from 'core/api/users/queries/admins';
import UsersTable from './UsersTable';

const getAdminsEmails = async () => {
  const admins = await adminsQuery.clone().fetchSync();
  const adminsEmails = admins.map(({ email }) => email);
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

const UsersPage = () => (
  <section className="card1 card-top users-page">
    <h1>
      <T id="collections.users" />
    </h1>
    <UsersTable showAssignee key="allUsers" tableFilters={usersTableFilters} />
  </section>
);

export default UsersPage;
