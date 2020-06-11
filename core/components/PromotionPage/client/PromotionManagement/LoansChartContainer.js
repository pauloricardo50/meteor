import { useMemo } from 'react';
import { withProps } from 'recompose';

const getData = loans => {
  const filteredDates = [
    ...new Set(loans.map(({ createdAt }) => createdAt.valueOf())),
  ].sort();

  const loansByDate = filteredDates.reduce(
    (sortedLoans, date) => ({
      ...sortedLoans,
      [date]: loans.filter(({ createdAt }) => createdAt.valueOf() <= date)
        .length,
    }),
    {},
  );

  return Object.keys(loansByDate).map(date => [
    Number(date),
    loansByDate[date],
  ]);
};

const getConfig = (data, loans = []) => ({
  chart: {
    type: 'line',
  },
  title: {
    text: 'Clients',
  },
  subtitle: { text: `${loans.length} clients` },
  xAxis: {
    type: 'datetime',
    title: { text: 'Date' },
  },
  yAxis: {
    title: {
      text: 'Nombre de clients',
    },
  },
  tooltip: {
    headerFormat: '<b>{series.name}</b><br>',
    pointFormat: '{point.x:%e. %b}: {point.y:.0f} clients',
  },

  plotOptions: {
    series: {
      marker: {
        enabled: true,
      },
      animation: false,
      turboThreshold: 1,
    },
  },
  series: [
    {
      name: 'Clients',
      data,
    },
  ],
});

export default withProps(({ loans = [] }) => {
  const data = useMemo(() => getData(loans), [loans.length]);

  return {
    config: getConfig(data, loans),
    data,
  };
});
