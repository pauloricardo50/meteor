import React from 'react';
import PropTypes from 'prop-types';

const MetricArea = ({ value }) => {
  if (value !== 0 && !value) {
    <span>
      0 m<sup>2</sup>
    </span>;
  }

  return (
    <span>
      {value} m<sup>2</sup>
    </span>
  );
};

MetricArea.propTypes = {
  value: PropTypes.number,
};

MetricArea.defaultProps = {
  value: undefined,
};

export default MetricArea;
