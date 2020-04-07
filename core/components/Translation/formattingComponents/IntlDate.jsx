import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedRelative, FormattedTime } from 'react-intl';

export const IntlDate = ({ type, ...props }) => {
  switch (type) {
    case 'time':
      return <FormattedTime {...props} />;
    case 'relative':
      return <FormattedRelative {...props} />;
    default:
      return <FormattedDate {...props} />;
  }
};

IntlDate.propTypes = {
  type: PropTypes.string,
};

export default IntlDate;
