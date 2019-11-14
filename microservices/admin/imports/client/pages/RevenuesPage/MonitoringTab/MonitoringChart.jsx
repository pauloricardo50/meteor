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
          name: 'Revenus attendus',
          data: data.map(({ expectedRevenues }) =>
            Math.round(expectedRevenues),
          ),
          stack: 'Revenus bruts',
          color: '#90ee90',
        },
        {
          name: 'Revenus perçus',
          data: data.map(({ paidRevenues }) => Math.round(paidRevenues)),
          stack: 'Revenus bruts',
          color: '#024b30',
        },
        {
          name: 'Rétrocession à payer',
          data: data.map(({ commissionsToPay }) =>
            Math.round(commissionsToPay),
          ),
          stack: 'Rétrocessions',
          color: '#f08080',
        },
        {
          name: 'Rétrocession payées',
          data: data.map(({ commissionsPaid }) => Math.round(commissionsPaid)),
          stack: 'Rétrocessions',
          color: '#8b0000',
        },
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
              dataLabels: {
                formatter() {
                  if (value === 'revenues') {
                    return `${Math.round(this.y / 1000)}k`;
                  }
                  if (value === 'loanValue') {
                    return `${Math.round(this.y / 1000000)}M`;
                  }
                  return this.y;
                },
              },
            },
            series: { dataLabels: { enabled: true } },
          },
        }}
        series={series}
      />
    </div>
  );
};

export default injectIntl(MonitoringChart);
