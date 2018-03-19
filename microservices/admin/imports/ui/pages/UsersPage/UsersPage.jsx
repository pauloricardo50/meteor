import React from 'react';
import { T } from 'core/components/Translation/';
import UsersTabs from './UsersTabs';

const UsersPage = props => (
  <section className="mask1">
    <h1>
      <T id="collections.users" />
    </h1>
    <UsersTabs {...props} />
  </section>
);

export default UsersPage;
