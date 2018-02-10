import PropTypes from 'prop-types';
import React from 'react';

import AllLoansTable from '/imports/ui/components/AllLoansTable';

const AdminLoansPage = props => (
  <section className="mask1">
    <h1>Demandes de Prêt</h1>

    <AllLoansTable {...props} />
  </section>
);

AdminLoansPage.propTypes = {
  loans: PropTypes.arrayOf(PropTypes.any),
  properties: PropTypes.arrayOf(PropTypes.object).isRequired,
};

AdminLoansPage.defaultProps = {
  loans: [],
  properties: [],
};

export default AdminLoansPage;
