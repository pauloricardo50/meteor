import React, { Component, PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

import LenderOffersTable from '/imports/ui/components/general/LenderOffersTable.jsx';

import RaisedButton from 'material-ui/RaisedButton';

import { toMoney } from '/imports/js/finance-math';

const styles = {
  button: {
    paddingTop: 100,
    paddingBottom: 100,
  },
  tableDiv: {
    overflowX: 'scroll',
    width: '100%',
  },
};


export default class Step2AuctionResults extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const partnerOffers = [
      {
        lender: 'Banque 1',
        maxAmount: toMoney(this.props.loanRequest.property.value * 0.8),
        amortizing: '1%',
        interest10: '0.89%',
        expertise: 'Non',
      }, {
        lender: 'Banque 2',
        maxAmount: toMoney(this.props.loanRequest.property.value * 0.68),
        amortizing: '1%',
        interest10: '0.99%',
        expertise: 'Oui',
      }, {
        lender: 'Banque 3',
        maxAmount: toMoney(this.props.loanRequest.property.value * 0.73),
        amortizing: '1%',
        interest10: '0.85%',
        expertise: 'Non',
      }, {
        lender: 'Assurance 1',
        maxAmount: toMoney(this.props.loanRequest.property.value * 0.72),
        amortizing: '1%',
        interest10: '0.91%',
        expertise: 'Non',
      }, {
        lender: 'Banque 4',
        maxAmount: toMoney(this.props.loanRequest.property.value * 0.79),
        amortizing: '1%',
        interest10: '0.85%',
        expertise: 'Non',
      }, {
        lender: 'Banque 5',
        maxAmount: toMoney(this.props.loanRequest.property.value * 0.78),
        amortizing: '1%',
        interest10: '0.85%',
        expertise: 'Non',
      },
    ];

    return (
      <section className="mask1 animated fadeIn">
        <h1>Les résultats sont arrivés!</h1>

        <div style={styles.button} className="text-center">
          <RaisedButton
            label="Choisir ma stratégie de taux"
            primary
            href="/finance/strategy"
          />
        </div>

        {/* Replace with this.props.loanRequest.partnerOffers */}
        <div style={styles.tableDiv}>
          <LenderOffersTable partnerOffers={partnerOffers} />
        </div>

      </section>
    );
  }
}

Step2AuctionResults.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
