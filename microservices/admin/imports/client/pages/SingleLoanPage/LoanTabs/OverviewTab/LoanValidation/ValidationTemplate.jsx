import React from 'react';
import PropTypes from 'prop-types';

import T from 'core/components/Translation';
import FullDate from 'core/components/dateComponents/FullDate';

const ValidationTemplate = ({ className, labelId, date }) => (
  <h2 className={className}>
    <T id={`LoanValidation.${labelId}`} /> <FullDate date={date} />
  </h2>
);

ValidationTemplate.propTypes = {
  className: PropTypes.string,
  date: PropTypes.instanceOf(Date).isRequired,
  labelId: PropTypes.string.isRequired,
};

ValidationTemplate.defaultProps = {
  className: '',
};

export default ValidationTemplate;
