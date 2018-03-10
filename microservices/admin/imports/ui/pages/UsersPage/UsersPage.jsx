import PropTypes from 'prop-types';
import React from 'react';

import AllUsersTable from './AllUsersTable';

const AdminUsersPage = props => (
  <section className="mask1">
    <h1>Utilisateurs</h1>

    <AllUsersTable {...props} />
  </section>
);

export default AdminUsersPage;
