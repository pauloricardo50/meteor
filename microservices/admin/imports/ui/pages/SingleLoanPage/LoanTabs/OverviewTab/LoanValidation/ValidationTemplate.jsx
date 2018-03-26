import React from 'react';
import PropTypes from 'prop-types';
import { T, IntlDate } from 'core/components/Translation';

const ValidationTemplate = ({ className, labelId, date }) => (
  <h2 className={className}>
    <T id={`LoanValidation.${labelId}`} />
    &nbsp;
    <IntlDate
      value={date}
      month="numeric"
      year="numeric"
      day="2-digit"
      hour="2-digit"
      minute="2-digit"
    />
  </h2>
);

ValidationTemplate.propTypes = {
  className: PropTypes.string,
  labelId: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
};

ValidationTemplate.defaultProps = {
  className: '',
};

export default ValidationTemplate;
