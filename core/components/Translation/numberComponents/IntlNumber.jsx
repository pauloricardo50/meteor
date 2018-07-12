import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber, FormattedPlural } from 'react-intl';

const shouldRenderDash = value => (!value && value !== 0) || value === Infinity;

const IntlNumber = ({ type, value, ...rest }) => {
  // Render a dash if the number is not well specified
  if (shouldRenderDash(value)) {
    return '-';
  } else if (typeof value !== 'number') {
    // Render whatever comes if it is not a number
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
  value: PropTypes.number,
};

IntlNumber.defaultProps = {
  value: undefined,
};

export default IntlNumber;
