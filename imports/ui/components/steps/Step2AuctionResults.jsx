import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import cleanMethod from '/imports/api/cleanMethods';

import PartnerOffersTable from '/imports/ui/components/general/PartnerOffersTable.jsx';

import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  section: {
    marginBottom: 40,
  },
  p: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  description: {
    maxWidth: 500,
    textAlign: 'justify-left',
    lineHeight: '1.5em',
  },
  lenderButton: {
    margin: '50px 0',
  },
  tableDiv: {
    overflowX: 'scroll',
    width: '100%',
  },
  continueButton: {
    float: 'right',
  },
};


export default class Step2AuctionResults extends Component {
  constructor(props) {
    super(props);

    this.getFakeOffers = this.getFakeOffers.bind(this);
    this.handleContinue = this.handleContinue.bind(this);
  }


  handleContinue() {
    if (this.props.loanRequest.logic.step < 2) {
      // Go to step 3
      const object = {};
      object['logic.step'] = 2;
      const id = this.props.loanRequest._id;

      cleanMethod('update', id, object,
      (error) => {
        if (!error) {
          FlowRouter.go('/step3');
        }
      });
    } else {
      FlowRouter.go('/step3');
    }
  }


  getFakeOffers() {
    const loanWanted = this.props.loanRequest.property.value -
      this.props.loanRequest.general.fortuneUsed -
      this.props.loanRequest.general.insuranceFortuneUsed;
    return [
      {
        standardOffer: {
          maxAmount: loanWanted * 1,
          amortizing: '1',
          interest10: '0.89',
        },
        expertiseRequired: false,
      }, {
        standardOffer: {
          maxAmount: loanWanted * 0.98,
          amortizing: '1',
          interest10: '0.99',
        },
        expertiseRequired: true,
      }, {
        standardOffer: {
          maxAmount: loanWanted * 1,
          amortizing: '1',
          interest10: '0.85',
        },
        expertiseRequired: true,
      }, {
        standardOffer: {
          maxAmount: loanWanted * 1,
          amortizing: '1',
          interest10: '0.91',
        },
        expertiseRequired: false,
      }, {
        standardOffer: {
          maxAmount: loanWanted * 0.96,
          amortizing: '1',
          interest10: '0.85',
        },
        expertiseRequired: false,
      }, {
        standardOffer: {
          maxAmount: loanWanted * 1,
          amortizing: '1',
          interest10: '0.85',
        },
        expertiseRequired: true,
      },
    ];
  }

  render() {
    return (
      <div>
        <section className="mask1" style={styles.section}>
          <h2>Vos résultats sont arrivés</h2>

          <div className="description">
            <p>
              Voici les offres que vous ont fait les prêteurs, les taux qu&apos;ils vous proposent
              fluctueront encore avec le marché, mais ne devraient pas varier de plus de 0.05%
              si vous concluez votre prêt dans le mois qui suit.
              <br /><br />
              Vous pouvez dès à présent choisir le prêteur que vous voulez et avoir une estimation
              très précise de ce que ce prêt va vous coûter.
            </p>
          </div>

          <div style={styles.tableDiv}>
            <PartnerOffersTable
              offers={this.props.offers && this.props.offers.length > 0 ?
                this.props.offers :
                this.getFakeOffers()
              }
            />
          </div>
        </section>

        <RaisedButton
          label="Continuer"
          primary
          onTouchTap={this.handleContinue}
          style={styles.continueButton}
        />
      </div>
    );
  }
}

Step2AuctionResults.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  offers: PropTypes.arrayOf(PropTypes.any),
};
