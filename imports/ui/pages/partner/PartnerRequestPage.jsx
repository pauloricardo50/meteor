import React, { Component, PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';


import RequestDetails from '/imports/ui/components/partner/RequestDetails.jsx';
import PartnerOfferForm from '/imports/ui/components/partner/PartnerOfferForm.jsx';


const styles = {
  section: {
    maxWidth: 1200,
    margin: 'auto',
  },
  back: {
    margin: 20,
  },
};

export default class PartnerRequestPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.creditRequest) {
      return (
        <section className="mask1" style={styles.section}>
          <RequestDetails creditRequest={this.props.creditRequest} />
          <PartnerOfferForm creditRequest={this.props.creditRequest} />
        </section>
      );
    }

    return (
      <div className="text-center">
        <h1>Il semblerait qu'il y ait eu une erreur.
          <br />
          Soit cette demande de prêt n'existe pas, soit vous n'êtes pas autorisé à la voir.
        </h1>
        <RaisedButton
          label="Retour"
          href="/partner"
          style={styles.back}
        />
      </div>
    );
  }
}

PartnerRequestPage.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
