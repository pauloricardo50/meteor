import React from 'react';
import PropTypes from 'prop-types';

// import { IntlNumber } from '..';
import { toMoney } from '../../../utils/conversionFunctions';

// The Intl standard for CHF is messed up, and display the currency after the
// monetary value, which is not what we want. Might be used later if we use
// more curencies
// const Money = ({ value }) => <IntlNumber value={value} format="money" />;
const Money = ({ value }) => <span>CHF {toMoney(value)}</span>;

Money.propTypes = {
  value: PropTypes.number.isRequired,
};

export default Money;
