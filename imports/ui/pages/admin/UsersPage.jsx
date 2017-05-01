import PropTypes from 'prop-types';
import React from 'react';

import AllUsersTable from '/imports/ui/components/admin/AllUsersTable.jsx';

const styles = {
  table: {
    margin: 'auto',
    width: 510, // Change this with the Table component
  },
};

const AdminUsersPage = props => (
  <section className="mask1">
    <h1>Utilisateurs</h1>

    <div style={styles.table}>
      <AllUsersTable {...props} />
    </div>
  </section>
);

AdminUsersPage.propTypes = {
  users: PropTypes.arrayOf(PropTypes.any),
};

AdminUsersPage.defaultProps = {
  users: [],
};

export default AdminUsersPage;
