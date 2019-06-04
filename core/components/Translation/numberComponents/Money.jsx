import React from 'react';
import PropTypes from 'prop-types';

import { toMoney } from '../../../utils/conversionFunctions';

const getValue = (displayZero, value, currency) => {
  if (!displayZero && (!value || value === 0)) {
    return '-';
  }

  if (value !== 0 && !value) {
    return currency ? 0 : <>CHF&nbsp;0</>;
  }

  return currency ? (
    <>
      CHF&nbsp;
      {toMoney(value)}
    </>
  ) : (
    toMoney(value)
  );
};

// The Intl standard for CHF is messed up, and display the currency after the
// monetary value, which is not what we want. We can use IntlNumber later on
// if needed
const Money = ({ value, currency, displayZero, className }) => (
  <span className={className}>{getValue(displayZero, value, currency)}</span>
);

Money.propTypes = {
  className: PropTypes.string,
  currency: PropTypes.bool,
  displayZero: PropTypes.bool,
  value: PropTypes.number,
};

Money.defaultProps = {
  className: '',
  currency: true,
  displayZero: true,
  value: 0,
};

export default Money;
