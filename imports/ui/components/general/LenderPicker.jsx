import React, { Component, PropTypes } from 'react';

import LenderTable1 from '/imports/ui/components/general/LenderTable1.jsx';
import LenderTable2 from '/imports/ui/components/general/LenderTable2.jsx';

const styles = {
  article: {
    overflow: 'scroll',
  },
};

export default class LenderPicker extends Component {
  constructor(props) {
    super(props);

    this.getBestOffers = this.getBestOffers.bind(this);
  }

  getOffers(withConditions) {
    const o = this.props.offers;
    const offersArray = [];

    if (o) {
      for (var i = 0; i < o.length; i++) {
        if (withConditions) {
          offersArray.push(o[i].standardOffer);
        } else {
          const offer = o[i].conditionsOffer;
          // Add the condition to this object to make it easier to handle
          offer.push(o[i].conditions);
          offersArray.push(offer);
        }
      }
    }

    return offersArray;
  }

  getBestOffers(withConditions) {
    const offers = this.getOffers(withConditions);
    // Will contain the monthly payment value for each offer
    const paymentsArray = [];
    const tranches = this.props.loanRequest.general.loanTranches;

    offers.forEach(offer => {
      // Will contain the monthly payment for each tranche of this offer
      const tranchePayment = [];
      tranches.forEach(tranche => {
        // Push the payment for this tranche to the array
        tranchePayment.push(tranche.value * offer[`${tranche.type}`] / 12);
      });
    });
  }

  render() {
    return (
      <article className="col-xs-12" style={styles.article}>
        <h3>Prêteurs recommandés</h3>

        <h4 className="text-center">Sans Conditions</h4>
        <LenderTable1
          loanRequest={this.props.loanRequest}
          partnerOffers={this.getBestOffers(false)}
        />
        <h4 className="text-center">Avec Conditions</h4>
        <LenderTable2
          loanRequest={this.props.loanRequest}
          partnerOffers={this.getBestOffers(true)}
        />

      </article>
    );
  }
}

LenderPicker.propTypes = {
  loanRequest: React.PropTypes.objectOf(React.PropTypes.any),
  offers: PropTypes.arrayOf(PropTypes.any),
};
