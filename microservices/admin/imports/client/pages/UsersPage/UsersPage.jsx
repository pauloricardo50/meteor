import React from 'react';

import T from 'core/components/Translation/';
import { ROLES, USERS_COLLECTION } from 'core/api/constants';
import adminsQuery from 'core/api/users/queries/admins';
import collectionIcons from 'core/arrays/collectionIcons';
import Icon from 'core/components/Icon';
import UsersTable from './UsersTable';

const getAdminsEmails = async () => {
  try {
    const admins = await adminsQuery.clone().fetchSync();
    const adminsEmails = admins.map(({ email }) => email);
    return [...adminsEmails, undefined];
  } catch (error) {
    return [undefined];
  }
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
    <h1 className="flex center-align">
      <Icon
        type={collectionIcons[USERS_COLLECTION]}
        style={{ marginRight: 8 }}
        size={32}
      />
      <T id="collections.users" />
    </h1>
    <UsersTable showAssignee key="allUsers" tableFilters={usersTableFilters} />
  </section>
);

export default UsersPage;
