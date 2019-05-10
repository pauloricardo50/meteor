import React from 'react';
import PropTypes from 'prop-types';

import { IntlNumber } from '..';

const Percent = ({ value, rounded, showPlus }) => (
  <IntlNumber
    value={value}
    format={rounded ? 'percentageRounded' : 'percentage'}
  >
    {formattedValue => (
      <span>
        {showPlus ? (value > 0 ? '+' : '') : ''}
        {formattedValue}
      </span>
    )}
  </IntlNumber>
);

Percent.propTypes = {
  showPlus: PropTypes.boolean,
  value: PropTypes.number,
};

Percent.defaultProps = {
  showPlus: false,
  value: undefined,
};

export default Percent;
