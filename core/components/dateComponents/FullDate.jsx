import React from 'react';
import PropTypes from 'prop-types';
import { T, IntlDate } from 'core/components/Translation';

const FullDate = ({ translationId, date }) => (
  <span>
    <T id={translationId} />{' '}
    <IntlDate
      value={date}
      month="numeric"
      year="numeric"
      day="2-digit"
      hour="2-digit"
      minute="2-digit"
    />
  </span>
);

FullDate.propTypes = {
  translationId: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
};

export default FullDate;
