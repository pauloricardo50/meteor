import React from 'react';
import PropTypes from 'prop-types';

import IntlDate from '../Translation/formattingComponents/IntlDate';

const FullDate = ({ date }) => (
  <IntlDate
    value={date}
    month="numeric"
    year="numeric"
    day="2-digit"
    hour="2-digit"
    minute="2-digit"
  />
);

FullDate.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
};

export default FullDate;
