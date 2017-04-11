import React, { Component, PropTypes } from 'react';

import OffersTable from '/imports/ui/components/general/OffersTable.jsx';
import FakeOfferAdder from '/imports/ui/components/general/FakeOfferAdder.jsx';
import OfferToggle from '/imports/ui/components/general/OfferToggle.jsx';

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

const getFakeOffers = props => {
  const loanWanted = props.loanRequest.property.value -
    props.loanRequest.general.fortuneUsed -
    props.loanRequest.general.insuranceFortuneUsed;
  return [
    {
      standardOffer: {
        maxAmount: loanWanted * 1,
        amortizing: '1',
        interest10: '0.89',
      },
      expertiseRequired: false,
    },
    {
      standardOffer: {
        maxAmount: loanWanted * 0.98,
        amortizing: '1',
        interest10: '0.99',
      },
      expertiseRequired: true,
    },
    {
      standardOffer: {
        maxAmount: loanWanted * 1,
        amortizing: '1',
        interest10: '0.85',
      },
      expertiseRequired: true,
    },
    {
      standardOffer: {
        maxAmount: loanWanted * 1,
        amortizing: '1',
        interest10: '0.91',
      },
      expertiseRequired: false,
    },
    {
      standardOffer: {
        maxAmount: loanWanted * 0.96,
        amortizing: '1',
        interest10: '0.85',
      },
      expertiseRequired: false,
    },
    {
      standardOffer: {
        maxAmount: loanWanted * 1,
        amortizing: '1',
        interest10: '0.85',
      },
      expertiseRequired: true,
    },
  ];
};

export default class Results extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSpecial: true,
    };
  }

  render() {
    return (
      <section className="mask1" style={styles.section}>
        <h1>Résultats des enchères</h1>

        <div className="description">
          <p>
            Voici les offres que vous ont fait les prêteurs, les taux qu'ils vous proposent
            fluctueront encore avec le marché, mais ne devraient pas varier de plus de 0.05%
            si vous concluez votre prêt dans le mois qui suit.
            <br /><br />
            Vous pouvez dès à présent choisir le prêteur que vous voulez et avoir une estimation
            très précise de ce que ce prêt va vous coûter.
          </p>
        </div>

        <FakeOfferAdder loanRequest={this.props.loanRequest} />

        <OfferToggle
          value={this.state.showSpecial}
          handleToggle={(e, c) => this.setState({ showSpecial: c })}
        />

        <div style={styles.tableDiv}>
          <OffersTable
            showSpecial={this.state.showSpecial}
            offers={
              this.props.offers.length > 0
                ? this.props.offers
                : getFakeOffers(this.props)
            }
          />
        </div>
      </section>
    );
  }
}

Results.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  offers: PropTypes.arrayOf(PropTypes.any),
};

Results.defaultProps = {
  offers: [],
};
