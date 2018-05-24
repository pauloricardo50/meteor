import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedTime, FormattedRelative } from 'react-intl';

export const IntlDate = (props) => {
  switch (props.type) {
  case 'time':
    return <FormattedTime {...props} />;
  case 'relative':
    return <FormattedRelative {...props} />;
  default:
    return <FormattedDate {...props} />;
  }
};

IntlDate.propTypes = {
  type: PropTypes.string.isRequired,
};

export default IntlDate;
