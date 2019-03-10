import React from 'react';
import PropTypes from 'prop-types';

import { toMoney } from '../../../utils/conversionFunctions';

// The Intl standard for CHF is messed up, and display the currency after the
// monetary value, which is not what we want. We can use IntlNumber later on
// if needed
const Money = ({ value, currency }) => {
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
  value: PropTypes.number,
};

Money.defaultProps = {
  currency: true,
  value: 0,
};

export default Money;
