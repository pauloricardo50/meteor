// @flow
import React from 'react';

import Chart from 'core/components/charts/Chart';
import { injectIntl } from 'react-intl';

type MonitoringChartProps = {};

const getX = ({ data, groupBy, f }) => {
  switch (groupBy) {
  case 'status':
    return data.map(({ _id }) => f({ id: `Forms.status.${_id}` }));

  default:
    return data.map(({ _id: { month, year } }) => `${month}/${year}`);
  }
};

const getSeries = ({ data, value }) => {
  switch (value) {
  case 'count':
    return [{ name: 'Total', data: data.map(({ count }) => count) }];
  case 'revenues':
    return [
      {
        name: 'Attendu',
        data: data.map(({ expectedRevenues }) => expectedRevenues),
      },
      { name: 'Payé', data: data.map(({ paidRevenues }) => paidRevenues) },
    ];
  case 'loanValue':
    return [
      {
        name: 'Volume hypothécaire',
        data: data.map(({ loanValue }) => loanValue),
      },
    ];
  default:
    break;
  }
};

const MonitoringChart = ({
  data,
  groupBy,
  value,
  intl: { formatMessage: f },
}: MonitoringChartProps) => {
  const categories = getX({ data, groupBy, f });
  const series = getSeries({ data, value });

  return (
    <div>
      <Chart
        config={{
          chart: { type: 'column' },
          xAxis: { categories },
          series,
          plotOptions: {
            column: {
              stacking: value === 'revenues' ? 'normal' : undefined,
            },
          },
        }}
        series={series}
      />
    </div>
  );
};

export default injectIntl(MonitoringChart);
