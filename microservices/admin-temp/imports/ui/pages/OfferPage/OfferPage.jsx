import PropTypes from 'prop-types';
import React from 'react';

import Button from 'core/components/Button';

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
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default AdminOfferPage;
