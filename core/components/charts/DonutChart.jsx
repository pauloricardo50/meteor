import React from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';

import PieChart from './PieChart';

const DonutChart = ({ config, ...rest }) => (
  <PieChart
    config={merge(config, { series: [{ innerSize: '60%' }] })}
    {...rest}
  />
);

DonutChart.propTypes = {
  config: PropTypes.object,
};

DonutChart.defaultProps = {
  config: {},
};

export default DonutChart;
