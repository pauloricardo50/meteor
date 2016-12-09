import React, { Component, PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

import LenderOffersTable from '/imports/ui/components/general/LenderOffersTable.jsx';

import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  button: {
    padding: 100,
  },
};

const lenderOffers = [
  {
    lender: 'Banque 1',
    maxAmount: 'CHF 675\'000',
    amortizing: '1%',
    interest10: '0.89%',
    expertise: 'Non',
  }, {
    lender: 'Banque 2',
    maxAmount: 'CHF 687\'000',
    amortizing: '1%',
    interest10: '0.99%',
    expertise: 'Oui',
  }, {
    lender: 'Banque 3',
    maxAmount: 'CHF 641\'000',
    amortizing: '1%',
    interest10: '0.85%',
    expertise: 'Non',
  }, {
    lender: 'Assurance 1',
    maxAmount: 'CHF 701\'000',
    amortizing: '1%',
    interest10: '0.91%',
    expertise: 'Non',
  }, {
    lender: 'Banque 4',
    maxAmount: 'CHF 641\'000',
    amortizing: '1%',
    interest10: '0.85%',
    expertise: 'Non',
  }, {
    lender: 'Banque 5',
    maxAmount: 'CHF 641\'000',
    amortizing: '1%',
    interest10: '0.85%',
    expertise: 'Non',
  },
];

export default class Step2AuctionResults extends Component {
  constructor(props) {
    super(props);
  }

  // handleClick() {
  //   FlowRouter.go('/finance');
  // }

  render() {
    return (
      <section className="mask1 animated fadeIn">
        <h1>Les résultats sont arrivés!</h1>

        <div style={styles.button} className="text-center">
          <RaisedButton
            label="Choisir ma stratégie de taux"
            primary
            href="/finance/strategy"
            // onClick={this.handleClick}
          />
        </div>

        {/* Replace with this.props.creditRequest.lenderOffers */}
        <LenderOffersTable lenderOffers={lenderOffers} />

      </section>
    );
  }
}

Step2AuctionResults.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
