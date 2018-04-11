import React from 'react';
import PropTypes from 'prop-types';

const MetricArea = ({ value }) => (
  <span>
    {value} m<sup>2</sup>
  </span>
);

MetricArea.propTypes = {
  value: PropTypes.number.isRequired,
};

export default MetricArea;
