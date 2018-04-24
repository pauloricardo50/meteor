import React from 'react';
import PropTypes from 'prop-types';

import { IntlNumber } from '..';

const Percent = ({ value }) => <IntlNumber value={value} format="percentage" />;

Percent.propTypes = {
  value: PropTypes.number.isRequired,
};

export default Percent;
