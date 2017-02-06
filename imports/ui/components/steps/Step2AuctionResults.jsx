import React, { Component, PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

import PartnerOffersTable from '/imports/ui/components/general/PartnerOffersTable.jsx';

import RaisedButton from 'material-ui/RaisedButton';

import { toMoney } from '/imports/js/conversionFunctions';

const styles = {
  button: {
    paddingTop: 40,
    paddingBottom: 60,
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
        standardOffer: {
          maxAmount: this.props.loanRequest.property.value * 0.8,
          amortizing: '1',
          interest10: '0.89',
        },
        expertiseRequired: false,
      }, {
        standardOffer: {
          maxAmount: this.props.loanRequest.property.value * 0.68,
          amortizing: '1',
          interest10: '0.99',
        },
        expertiseRequired: true,
      }, {
        standardOffer: {
          maxAmount: this.props.loanRequest.property.value * 0.73,
          amortizing: '1',
          interest10: '0.85',
        },
        expertiseRequired: true,
      }, {
        standardOffer: {
          maxAmount: this.props.loanRequest.property.value * 0.72,
          amortizing: '1',
          interest10: '0.91',
        },
        expertiseRequired: false,
      }, {
        standardOffer: {
          maxAmount: this.props.loanRequest.property.value * 0.79,
          amortizing: '1',
          interest10: '0.85',
        },
        expertiseRequired: false,
      }, {
        standardOffer: {
          maxAmount: this.props.loanRequest.property.value * 0.78,
          amortizing: '1',
          interest10: '0.85',
        },
        expertiseRequired: true,
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

        <div style={styles.tableDiv}>
          <PartnerOffersTable
            offers={this.props.offers && this.props.offers.length > 0 ?
              this.props.offers :
              partnerOffers
            }
          />
        </div>

      </section>
    );
  }
}

Step2AuctionResults.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  offers: PropTypes.arrayOf(PropTypes.any),
};
