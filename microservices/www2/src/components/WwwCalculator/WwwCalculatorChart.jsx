import React from 'react';
import { useIntl } from 'react-intl';

import Chart from 'core/components/charts2/Chart';
import useWindowSize from 'core/hooks/useWindowSize';
import { toMoney } from 'core/utils/conversionFunctions';

import WwwCalculatorChartForm from './WwwCalculatorChartForm';
import { getYearlyCost } from './wwwCalculatorMath';
import { useWwwCalculator } from './WwwCalculatorState';

const WwwCalculatorChart = () => {
  const { width: windowWidth } = useWindowSize();
  const { formatMessage } = useIntl();
  const [state] = useWwwCalculator();
  const yearlyValues = getYearlyCost(state);
  const data = Object.keys(yearlyValues).map(valueName => ({
    y: Math.round(yearlyValues[valueName] / 12) || 0,
    name: formatMessage({ id: `WwwCalculatorChart.${valueName}` }),
  }));
  const total = data.reduce((acc, val) => acc + val.y, 0) || 0;

  if (total === 0) {
    return null;
  }

  return (
    <div className="www-calculator-chart">
      <Chart
        options={{
          chart: {
            type: 'pie',
            styledMode: true,
            height: '100%', // 1:1 aspect ratio
            width: Math.min(windowWidth - 32, 600),
          },
          title: {
            text: formatMessage(
              { id: 'WwwCalculatorChart.title' },
              { total: toMoney(total) },
            ),
            align: 'center',
            verticalAlign: 'middle',
          },
          plotOptions: {
            pie: {
              center: ['50%', '50%'],
              tooltip: {
                headerFormat: '<b>{point.key}</b><br />',
                pointFormat: 'CHF {point.y:,.0f}',
              },
              dataLabels: {
                enabled: true,
                formatter() {
                  if (windowWidth < 500) {
                    return;
                  }
                  return this.y
                    ? `<div><b>${this.key}</b><br>CHF ${toMoney(this.y)}</div>`
                    : null;
                },
              },
            },
          },
          series: [{ innerSize: '75%', data }],
        }}
      />

      <WwwCalculatorChartForm />
    </div>
  );
};
export default WwwCalculatorChart;
