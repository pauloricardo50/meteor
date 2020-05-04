import React from 'react';
import { Helmet } from 'react-helmet';

import { USERS_COLLECTION } from 'core/api/users/userConstants';
import collectionIcons from 'core/arrays/collectionIcons';
import Icon from 'core/components/Icon';
import T from 'core/components/Translation';

import UsersTable from './UsersTable';

const UsersPage = () => (
  <section className="card1 card-top users-page">
    <Helmet>
      <title>Comptes</title>
    </Helmet>
    <h1 className="flex center-align">
      <Icon
        type={collectionIcons[USERS_COLLECTION]}
        style={{ marginRight: 8 }}
        size={32}
      />
      <T id="collections.users" />
    </h1>
    <UsersTable showAssignee key="allUsers" />
  </section>
);

export default UsersPage;
