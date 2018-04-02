import React from 'react';
import PropTypes from 'prop-types';

import DonutChart from 'core/components/charts/DonutChart';
import { getBorrowerIncome } from 'core/utils/borrowerFunctions';

import DashboardRecapChartInfo from './DashboardRecapChartInfo';
import DashboardRecapChartLegend from './DashboardRecapChartLegend';

const getRevenuePercent = (total, monthlyIncome) =>
  (100 * total / monthlyIncome).toFixed(2);

const DashboardRecapChart = (props) => {
  const data = [
    { id: 'general.interests', value: 800 },
    { id: 'general.amortization', value: 800 },
    { id: 'general.buildingMaintenance', value: 800 },
  ];
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const monthlyIncome = getBorrowerIncome({ borrowers: props.borrowers }) / 12;
  return (
    <div className="card-bottom dashboard-recap-chart">
      <h3>Coût mensuel</h3>

      <div className="chart">
        <DonutChart
          data={data}
          config={{
            chart: { margin: 0, width: 120, height: 120 },
            legend: { enabled: false },
          }}
        />
        <DashboardRecapChartInfo
          {...props}
          revenuePercent={getRevenuePercent(total, monthlyIncome)}
          total={total}
        />
        <DashboardRecapChartLegend data={data} />
      </div>
    </div>
  );
};

DashboardRecapChart.propTypes = {};

export default DashboardRecapChart;
