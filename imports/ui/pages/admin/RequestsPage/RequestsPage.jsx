import PropTypes from 'prop-types';
import React from 'react';

import AllRequestsTable from '/imports/ui/components/admin/AllRequestsTable';

const styles = {
  table: {
    margin: 'auto',
    width: 990, // Change this with the Table component
  },
};

const AdminRequestsPage = props => (
  <section className="mask1">
    <h1>Demandes de Prêt</h1>

    <div style={styles.table}>
      <AllRequestsTable {...props} />
    </div>
  </section>
);

AdminRequestsPage.propTypes = {
  loanRequests: PropTypes.arrayOf(PropTypes.any),
};

AdminRequestsPage.defaultProps = {
  loanRequests: [],
};

export default AdminRequestsPage;
