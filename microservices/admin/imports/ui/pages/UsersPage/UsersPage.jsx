import PropTypes from 'prop-types';
import React from 'react';

import UsersTable from './UsersTable';

const AdminUsersPage = props => (
  <section className="mask1">
    <h1>Utilisateurs</h1>

    <UsersTable {...props} showAssignee />
  </section>
);

export default AdminUsersPage;
