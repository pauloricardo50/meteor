import PropTypes from 'prop-types';
import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  backButton: {
    marginBottom: 20,
  },
};

const AdminOfferPage = props => (
  <section>
    <RaisedButton label="Retour" style={styles.backButton} />
    <div className="mask1">
      Salut!
    </div>
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
