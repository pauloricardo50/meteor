import React from 'react';
import PropTypes from 'prop-types';

import { toMoney } from '../../../utils/conversionFunctions';

// The Intl standard for CHF is messed up, and display the currency after the
// monetary value, which is not what we want. We can use IntlNumber later on
// if needed
const Money = ({ value }) => {
  if (value !== 0 && !value) {
    return <span>CHF 0</span>;
  }

  return <span>CHF {toMoney(value)}</span>;
};

Money.propTypes = {
  value: PropTypes.number.isRequired,
};

export default Money;
