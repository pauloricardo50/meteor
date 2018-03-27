import React from 'react';
import PropTypes from 'prop-types';
import FullDate from 'core/components/FullDate';

const ValidationTemplate = ({ className, labelId, date }) => (
  <h2 className={className}>
    <FullDate translationId={labelId} date={date} />
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
