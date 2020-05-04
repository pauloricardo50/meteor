import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';

import { toMoney } from '../../../utils/conversionFunctions';

const getValue = ({ displayZero, value, currency, rounded }) => {
  if (!displayZero && (!value || value === 0)) {
    return '-';
  }

  if (value !== 0 && !value) {
    return currency ? 0 : <>CHF&nbsp;0</>;
  }

  return currency ? (
    <>
      CHF&nbsp;
      {toMoney(value, { rounded })}
    </>
  ) : (
    toMoney(value, { rounded })
  );
};

// The Intl standard for CHF is messed up, and display the currency after the
// monetary value, which is not what we want. We can use IntlNumber later on
// if needed
const Money = ({
  value,
  currency,
  displayZero,
  className,
  tag: Tag,
  rounded,
  tooltip,
}) => {
  const component = (
    <Tag className={className}>
      {getValue({ displayZero, value, currency, rounded })}
    </Tag>
  );
  return tooltip ? <Tooltip title={tooltip}>{component}</Tooltip> : component;
};

Money.propTypes = {
  className: PropTypes.string,
  currency: PropTypes.bool,
  displayZero: PropTypes.bool,
  tag: PropTypes.string,
  value: PropTypes.number,
};

Money.defaultProps = {
  className: '',
  currency: true,
  displayZero: true,
  tag: 'span',
  value: 0,
};

export default Money;
