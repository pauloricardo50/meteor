import React from 'react';
import PropTypes from 'prop-types';

import DonutChart from 'core/components/charts/DonutChart';
import { getBorrowerIncome } from 'core/utils/borrowerFunctions';
import { T } from 'core/components/Translation';
import { getInterests, getAmortization } from 'core/utils/finance-math';
import { getInterestsWithOffer } from 'core/utils/loanFunctions';
import DashboardRecapChartInfo from './DashboardRecapChartInfo';
import DashboardRecapChartLegend from './DashboardRecapChartLegend';

const getRevenuePercent = (total, monthlyIncome) =>
  (100 * total / monthlyIncome).toFixed(2);

const getChartData = (props) => {
  const { offer, interestRate } = props;
  let interests = 0;

  if (offer) {
    interests = getInterestsWithOffer(props, false);
  } else {
    interests = getInterests(props, interestRate);
  }

  return [
    {
      id: 'general.interests',
      value: interests,
    },
    {
      id: 'general.amortization',
      value: getAmortization(props).amortization,
    },
    { id: 'general.buildingMaintenance', value: 800 },
  ].map(dataPoint => ({ ...dataPoint, value: Math.round(dataPoint.value) }));
};

const DashboardRecapChart = (props) => {
  const { borrowers } = props;
  const data = getChartData(props);
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const monthlyIncome = getBorrowerIncome({ borrowers }) / 12;

  return (
    <div className="card-bottom dashboard-recap-chart">
      <h3>
        <T id="DashboardRecapChart.title" />
      </h3>

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

DashboardRecapChart.propTypes = {
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  interestRate: PropTypes.number,
  offer: PropTypes.object,
};

DashboardRecapChart.defaultProps = {
  interestRate: undefined,
  offer: undefined,
};

export default DashboardRecapChart;
