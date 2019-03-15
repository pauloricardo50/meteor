import React from 'react';
import PropTypes from 'prop-types';

import { toMoney } from '../../../utils/conversionFunctions';

// The Intl standard for CHF is messed up, and display the currency after the
// monetary value, which is not what we want. We can use IntlNumber later on
// if needed
const Money = ({ value, currency, displayZero }) => {
  if (!displayZero && (!value || value === 0)) {
    return <span>-</span>;
  }

  if (value !== 0 && !value) {
    return currency ? <span>0</span> : <span>CHF 0</span>;
  }

  return currency ? (
    <span>CHF {toMoney(value)}</span>
  ) : (
    <span>{toMoney(value)}</span>
  );
};

Money.propTypes = {
  currency: PropTypes.bool,
  displayZero: PropTypes.bool,
  value: PropTypes.number,
};

Money.defaultProps = {
  currency: true,
  displayZero: true,
  value: 0,
};

export default Money;
