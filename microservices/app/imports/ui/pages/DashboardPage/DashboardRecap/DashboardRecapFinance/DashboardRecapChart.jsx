import React from 'react';
import PropTypes from 'prop-types';

import DashboardRecapChartInfo from './DashboardRecapChartInfo';
import DashboardRecapChartLegend from './DashboardRecapChartLegend';

const DashboardRecapChart = (props) => {
  const data = [
    { id: 'general.interests', value: 1 },
    { id: 'general.amortization', value: 1 },
    { id: 'general.buildingMaintenance', value: 1 },
  ];
  const total = data.reduce((sum, val) => sum + val, 0);
  return (
    <div className="card-bottom dashboard-recap-chart">
      <h3>Coût mensuel</h3>

      <div className="chart">
        <div>chart</div>
        <DashboardRecapChartInfo {...props} total={total} />
        <DashboardRecapChartLegend data={data} />
      </div>
    </div>
  );
};

DashboardRecapChart.propTypes = {};

export default DashboardRecapChart;
