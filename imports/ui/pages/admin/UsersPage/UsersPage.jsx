import PropTypes from 'prop-types';
import React from 'react';

import AllUsersTable from '/imports/ui/components/admin/AllUsersTable';

const AdminUsersPage = props => (
  <section className="mask1">
    <h1>Utilisateurs</h1>

    <AllUsersTable {...props} />
  </section>
);

AdminUsersPage.propTypes = {
  users: PropTypes.arrayOf(PropTypes.any),
};

AdminUsersPage.defaultProps = {
  users: [],
};

export default AdminUsersPage;
