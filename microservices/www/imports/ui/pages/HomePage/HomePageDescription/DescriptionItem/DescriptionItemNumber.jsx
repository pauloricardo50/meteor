import React from 'react';
import PropTypes from 'prop-types';

const DescriptionItemNumber = ({ value }) => (
  <span className="description-item-number">
    <p>{value}</p>
  </span>
);

DescriptionItemNumber.propTypes = {
  value: PropTypes.number.isRequired,
};

export default DescriptionItemNumber;
