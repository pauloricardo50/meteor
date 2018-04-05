import React from 'react';
import PropTypes from 'prop-types';
import FullDate from 'core/components/dateComponents/FullDate';

const ValidationTemplate = ({ className, labelId, date }) => (
  <h2 className={className}>
    <FullDate translationId={`LoanValidation.${labelId}`} date={date} />
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
