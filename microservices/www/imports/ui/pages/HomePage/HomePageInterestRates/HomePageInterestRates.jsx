import React from 'react';
import PropTypes from 'prop-types';

import HomePageInterestRatesContainer from './HomePageInterestRatesContainer';
import InterestRate from './InterestRate';

const HomePageInterestRates = ({ rates }) => (
  <div className="interest-rates">
    {rates.map(rate => <InterestRate {...rate} key={rate.type} />)}
  </div>
);

HomePageInterestRates.propTypes = {};

export default HomePageInterestRatesContainer(HomePageInterestRates);
