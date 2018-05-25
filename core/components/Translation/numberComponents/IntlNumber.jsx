import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber, FormattedPlural } from 'react-intl';

const IntlNumber = ({ type, value, ...rest }) => {
  // If this is passed something else than a number, render the value directly
  if (typeof value !== 'number') {
    return value;
  }

  switch (type) {
  case 'plural':
    return <FormattedPlural {...rest} value={value} />;
  default:
    return <FormattedNumber {...rest} value={value} />;
  }
};

IntlNumber.propTypes = {
  value: PropTypes.number.isRequired,
};

export default IntlNumber;
