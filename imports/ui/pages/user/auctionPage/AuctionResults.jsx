import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

import OffersTable from '/imports/ui/components/general/OffersTable.jsx';
import FakeOfferAdder from '/imports/ui/components/general/FakeOfferAdder.jsx';
import OfferToggle from '/imports/ui/components/general/OfferToggle.jsx';
import { T } from '/imports/ui/components/general/Translation.jsx';

import CountUp from 'react-countup';

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
  countUp: {
    display: 'inline-block',
    width: '100%',
    marginTop: 40,
  },
};

const getFakeOffers = props => {
  const loanWanted =
    props.loanRequest.property.value -
    props.loanRequest.general.fortuneUsed -
    props.loanRequest.general.insuranceFortuneUsed;
  return [
    {
      standardOffer: {
        maxAmount: loanWanted * 1,
        amortization: '1',
        interest10: '0.89',
      },
      expertiseRequired: false,
    },
    {
      standardOffer: {
        maxAmount: loanWanted * 0.98,
        amortization: '1',
        interest10: '0.99',
      },
      expertiseRequired: true,
    },
    {
      standardOffer: {
        maxAmount: loanWanted * 1,
        amortization: '1',
        interest10: '0.85',
      },
      expertiseRequired: true,
    },
    {
      standardOffer: {
        maxAmount: loanWanted * 1,
        amortization: '1',
        interest10: '0.91',
      },
      expertiseRequired: false,
    },
    {
      standardOffer: {
        maxAmount: loanWanted * 0.96,
        amortization: '1',
        interest10: '0.85',
      },
      expertiseRequired: false,
    },
    {
      standardOffer: {
        maxAmount: loanWanted * 1,
        amortization: '1',
        interest10: '0.85',
      },
      expertiseRequired: true,
    },
  ];
};

class AuctionResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSpecial: false,
    };
  }

  render() {
    const f = this.props.intl.formatMessage;
    return (
      <section className="mask1 animated fadeIn" style={styles.section}>
        <h1><T id="AuctionResults.title" /></h1>

        <h1 className="text-center display2" style={styles.countUp}>
          <CountUp
            className="custom-count"
            start={0}
            end={this.props.offers.length}
            duration={3.5}
            useEasing
            separator=" "
            decimal=","
            prefix=""
            suffix={f({ id: 'AuctionResults.countSuffix' })}
          />
        </h1>

        <div className="description">
          <p>
            <T id="AuctionResults.description" />
          </p>
        </div>

        <FakeOfferAdder loanRequest={this.props.loanRequest} />

        <OfferToggle
          value={this.state.showSpecial}
          handleToggle={(e, c) => this.setState({ showSpecial: c })}
          offers={this.props.offers}
        />

        <div style={styles.tableDiv}>
          <OffersTable showSpecial={this.state.showSpecial} offers={this.props.offers} />
        </div>
      </section>
    );
  }
}

AuctionResults.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  offers: PropTypes.arrayOf(PropTypes.any),
};

AuctionResults.defaultProps = {
  offers: [],
};

export default injectIntl(AuctionResults);
