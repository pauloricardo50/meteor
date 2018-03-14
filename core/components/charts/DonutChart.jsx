import React from 'react';

import PieChart from './PieChart';

const DonutChart = props => (
  <PieChart config={{ series: [{ innerSize: '60%' }] }} {...props} />
);

export default DonutChart;
