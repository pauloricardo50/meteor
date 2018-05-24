import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber, FormattedPlural } from 'react-intl';

const IntlNumber = (props) => {
  // If this is passed something else than a number, render the value directly
  if (typeof props.value !== 'number') {
    return props.value || null;
  }

  switch (props.type) {
  case 'plural':
    return <FormattedPlural {...props} />;
  default:
    return <FormattedNumber {...props} />;
  }
};

IntlNumber.propTypes = {
  value: PropTypes.number.isRequired,
};

export default IntlNumber;
