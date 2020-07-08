import React from 'react';
import { useIntl } from 'react-intl';

// import BaseChart from 'core/components/charts/BaseChart';
import Chart from 'core/components/charts2/Chart';
import colors from 'core/config/colors';
import { toMoney } from 'core/utils/conversionFunctions';

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
  const [{ fortune, property, wantedLoan, purchaseType }] = useWwwCalculator();
  const interestRate = 0.015;
  const loanValue =
    purchaseType === PURCHASE_TYPE.ACQUISITION
      ? getLoanValue(property.value, fortune.value)
      : wantedLoan;
  const yearlyValues = {
    interests: getSimpleYearlyInterests(loanValue, interestRate),
    amortization: getYearlyAmortization({
      propertyValue: property.value,
      loanValue,
    }),
    maintenance: getSimpleYearlyMaintenance(property.value),
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
          chart: { type: 'pie', styledMode: true },
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
              dataLabels: { enabled: true },
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
    </div>
  );
};
export default WwwCalculatorChart;
