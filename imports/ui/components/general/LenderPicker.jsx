import React, { Component, PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';


import LenderTable1 from '/imports/ui/components/general/LenderTable1.jsx'
import LenderTable2 from '/imports/ui/components/general/LenderTable2.jsx'

const styles = {
};

export default class LenderPicker extends Component {
  constructor(props) {
    super(props);

    this.getBestOffers = this.getBestOffers.bind(this);
  }

  getOffers(withConditions) {
    const r = this.props.creditRequest;
    const offers = [];
    for (var i = 0; i < r.lenderOffers.length; i++) {
      if (withConditions) {
        offers.push(r.lenderOffers[i].standard);
      } else {
        const offer = r.lenderOffers[i].withConditions;
        // Add the condition to this object to make it easier to handle
        offer.push(r.lenderOffers[i].conditions);
        offers.push(offer);
      }
    }
    return offers;
  }

  getBestOffers(withConditions) {
    const offers = this.getOffers(withConditions);
    // Will contain the monthly payment value for each offer
    const paymentsArray = [];
    const tranches = this.props.creditRequest.loanInfo.tranches;

    offers.forEach((offer) => {
      // Will contain the monthly payment for each tranche of this offer
      const tranchePayment = [];
      tranches.forEach((tranche) => {
        // Push the payment for this tranche to the array
        tranchePayment.push((tranche.value * offer[`${tranche.type}`]) / 12);
      });
    });
  }

  render() {
    return (
      <article className="col-xs-12">
        <h3>Prêteurs recommandés</h3>

        <h4 className="text-center">Sans Conditions</h4>
        <LenderTable1
          creditRequest={this.props.creditRequest}
          lenderOffers={this.getBestOffers(false)}
        />
        <h4 className="text-center">Avec Conditions</h4>
        <LenderTable2
          creditRequest={this.props.creditRequest}
          lenderOffers={this.getBestOffers(true)}
        />

      </article>
    );
  }
}

LenderPicker.propTypes = {
  creditRequest: React.PropTypes.objectOf(React.PropTypes.any),
};
