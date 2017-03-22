import React, { PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  backButton: {
    marginBottom: 20,
  },
};

const AdminOfferPage = props => (
  <div>
    <RaisedButton label="Retour" style={styles.backButton} />
    <section className="mask1">
      Salut!
    </section>
  </div>
);

AdminOfferPage.defaultProps = {
  offer: {},
};

AdminOfferPage.propTypes = {
  offer: PropTypes.objectOf(PropTypes.any),
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default AdminOfferPage;
