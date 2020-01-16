// @flow
import React from 'react';

import Chart from 'core/components/charts/Chart';
import { injectIntl } from 'react-intl';
import colors from 'core/config/colors';

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
          name: 'Revenus bruts attendus',
          data: data.map(({ expectedRevenues }) =>
            Math.round(expectedRevenues),
          ),
          stack: 'Revenus bruts',
          color: '#90ee90',
        },
        {
          name: 'Revenus bruts perçus',
          data: data.map(({ paidRevenues }) => Math.round(paidRevenues)),
          stack: 'Revenus bruts',
          color: '#024b30',
        },
        {
          name: 'Revenus nets',
          data: data.map(({ revenues, commissionsToPay, commissionsPaid }) =>
            Math.round(revenues - commissionsPaid - commissionsToPay),
          ),
          stack: 'Commissions',
          color: colors.primary,
        },
        {
          name: 'Commissions à payer',
          data: data.map(({ commissionsToPay }) =>
            Math.round(commissionsToPay),
          ),
          stack: 'Commissions',
          color: '#f08080',
        },
        {
          name: 'Commissions payées',
          data: data.map(({ commissionsPaid }) => Math.round(commissionsPaid)),
          stack: 'Commissions',
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
