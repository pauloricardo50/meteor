import React from 'react';
import PropTypes from 'prop-types';

import { IntlNumber } from '..';

const Percent = ({ value, rounded }) => (
  <IntlNumber
    value={value}
    format={rounded ? 'percentageRounded' : 'percentage'}
  />
);

Percent.propTypes = {
  value: PropTypes.number.isRequired,
};

export default Percent;
