import React from 'react';
import PropTypes from 'prop-types';

import DashboardRecapChartInfo from './DashboardRecapChartInfo';
import DashboardRecapChartLegend from './DashboardRecapChartLegend';

const DashboardRecapChart = props => (
  <div className="card-bottom">
    <div className="chart">
      <div>chart</div>
      <DashboardRecapChartInfo {...props} />
    </div>
    <DashboardRecapChartLegend />
  </div>
);

DashboardRecapChart.propTypes = {};

export default DashboardRecapChart;
