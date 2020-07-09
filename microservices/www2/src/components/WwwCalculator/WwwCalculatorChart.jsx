import React from 'react';
import { useIntl } from 'react-intl';

import Chart from 'core/components/charts2/Chart';
import { toMoney } from 'core/utils/conversionFunctions';

import WwwCalculatorChartForm from './WwwCalculatorChartForm';
import { PURCHASE_TYPE } from './wwwCalculatorConstants';
import {
  getLoanValue,
  getSimpleYearlyInterests,
  getSimpleYearlyMaintenance,
  getYearlyAmortization,
} from './wwwCalculatorMath';
import { useWwwCalculator } from './WwwCalculatorState';

const WwwCalculatorChart = () => {
  const { formatMessage } = useIntl();
  const [
    {
      fortune,
      property,
      wantedLoan,
      purchaseType,
      interestRate,
      includeMaintenance,
    },
  ] = useWwwCalculator();
  const loanValue =
    purchaseType === PURCHASE_TYPE.ACQUISITION
      ? getLoanValue(property.value, fortune.value)
      : wantedLoan.value;
  const yearlyValues = {
    interests: getSimpleYearlyInterests(loanValue, interestRate),
    amortization: getYearlyAmortization({
      propertyValue: property.value,
      loanValue,
    }),
    maintenance:
      includeMaintenance && getSimpleYearlyMaintenance(property.value),
  };
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
          chart: { type: 'pie', styledMode: true, height: 500 },
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
                  return this.y
                    ? `<div><b>${this.key}</b><br>CHF ${toMoney(this.y)}</div>`
                    : null;
                },
              },
            },
          },
          series: [{ innerSize: '75%', data }],
          responsive: {
            rules: [
              {
                condition: { maxWidth: 400 },
                chartOptions: { chart: { width: 300 } },
              },
            ],
          },
        }}
      />

      <WwwCalculatorChartForm />
    </div>
  );
};
export default WwwCalculatorChart;
