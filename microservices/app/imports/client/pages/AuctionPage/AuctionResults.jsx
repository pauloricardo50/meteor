import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import CountUp from 'react-countup';

import T from 'core/components/Translation';

import InterestRanges from './InterestRanges';

const styles = {
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

const AuctionResults = ({ intl: { formatMessage: f }, offers }) => (
  <section className="mask1 animated fadeIn auction-page-results">
    <h1 className="title">
      <T id="AuctionResults.title" />
    </h1>

    <h1 className="text-center display2" style={styles.countUp}>
      <CountUp
        className="custom-count"
        start={0}
        end={offers.length}
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

    <div className="flex center auction-page-results-interests">
      <InterestRanges offers={offers} />
    </div>
  </section>
);

AuctionResults.propTypes = {
  offers: PropTypes.arrayOf(PropTypes.any),
};

AuctionResults.defaultProps = {
  offers: [],
};

export default injectIntl(AuctionResults);
