import PropTypes from 'prop-types';
import React from 'react';

import Button from '/imports/ui/components/general/Button';

const styles = {
  backButton: {
    marginBottom: 20,
  },
};

const AdminOfferPage = props => (
  <section>
    <Button raised label="Retour" style={styles.backButton} />
    <div className="mask1">Salut!</div>
  </section>
);

AdminOfferPage.defaultProps = {
  offer: {},
};

AdminOfferPage.propTypes = {
  offer: PropTypes.objectOf(PropTypes.any),
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default AdminOfferPage;
