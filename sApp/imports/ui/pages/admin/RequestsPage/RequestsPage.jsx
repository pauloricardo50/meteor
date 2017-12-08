import PropTypes from 'prop-types';
import React from 'react';

import AllRequestsTable from '/imports/ui/components/admin/AllRequestsTable';

const AdminRequestsPage = props => (
  <section className="mask1">
    <h1>Demandes de Prêt</h1>

    <AllRequestsTable {...props} />
  </section>
);

AdminRequestsPage.propTypes = {
  loanRequests: PropTypes.arrayOf(PropTypes.any),
};

AdminRequestsPage.defaultProps = {
  loanRequests: [],
};

export default AdminRequestsPage;
