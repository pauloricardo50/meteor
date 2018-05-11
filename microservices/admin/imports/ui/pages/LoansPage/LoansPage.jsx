import PropTypes from 'prop-types';
import React from 'react';

import AllLoansTable from './AllLoansTable';
import LoansPageContainer from './LoansPageContainer';

const LoansPage = (props) => (
  <section className="mask1">
    <h1>Demandes de Prêt</h1>

    <AllLoansTable {...props} loans={props.data} />
  </section>
);

LoansPage.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any),
  isLoading: PropTypes.bool,
};

LoansPage.defaultProps = {
  data: undefined,
  isLoading: false,
};

export default LoansPageContainer(LoansPage);
