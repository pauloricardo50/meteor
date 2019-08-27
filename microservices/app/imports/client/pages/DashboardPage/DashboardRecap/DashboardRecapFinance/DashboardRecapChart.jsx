import React from 'react';
import PropTypes from 'prop-types';

import DonutChart from 'core/components/charts/DonutChart';
import T from 'core/components/Translation';
import { withCalculator } from 'core/containers/withCalculator';
import DashboardRecapChartInfo from './DashboardRecapChartInfo';
import DashboardRecapChartLegend from './DashboardRecapChartLegend';

const getChartData = ({ loan, Calculator }) => {
  const interests = Calculator.getInterests({ loan });

  let data = [
    {
      id: 'general.interests',
      value: interests,
    },
    {
      id: 'general.amortization',
      value: Calculator.getAmortization({ loan }),
    },
  ];

  const expenses = Calculator.selectPropertyKey({
    loan,
    key: 'yearlyExpenses',
  });

  if (expenses) {
    data = [...data, { id: 'Forms.yearlyExpenses.short', value: expenses }];
  }

  return data.map(dataPoint => ({
    ...dataPoint,
    value: Math.round(dataPoint.value),
  }));
};

const DashboardRecapChart = (props) => {
  const data = getChartData(props);
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="card-bottom dashboard-recap-chart">
      <h3>
        <T id="DashboardRecapChart.title" />
      </h3>

      <div className="chart">
        <DashboardRecapChartInfo {...props} total={total} />
        <DonutChart
          data={data}
          config={{
            chart: { margin: 0, width: 120, height: 120, spacing: 0 },
            legend: { enabled: false },
            plotOptions: {
              pie: {
                tooltip: {
                  headerFormat: '<b>{point.key}</b><br />',
                  pointFormat: 'CHF {point.y:,.0f}',
                },
              },
            },
          }}
        />
        <DashboardRecapChartLegend data={data} />
      </div>
    </div>
  );
};

DashboardRecapChart.propTypes = {
  interestRate: PropTypes.number,
  loan: PropTypes.object.isRequired,
  offer: PropTypes.object,
};

DashboardRecapChart.defaultProps = {
  interestRate: undefined,
  offer: undefined,
};

export default withCalculator(DashboardRecapChart);
