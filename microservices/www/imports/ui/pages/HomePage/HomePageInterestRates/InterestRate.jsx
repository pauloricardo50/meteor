import React from 'react';
import PropTypes from 'prop-types';

import { INTEREST_TREND } from 'core/api/constants';
import { T, IntlNumber } from 'core/components/Translation';

const InterestRate = ({ type, low, high, trend }) => (
  <div className="rate">
    <span className="type">
      <T id={`offer.${type}`} />
    </span>
    <span className="value">
      <span className={`trend ${trend}`} />
      <IntlNumber format="percentage" value={low} /> -{' '}
      <IntlNumber format="percentage" value={high} />
    </span>
  </div>
);

InterestRate.propTypes = {};

export default InterestRate;
