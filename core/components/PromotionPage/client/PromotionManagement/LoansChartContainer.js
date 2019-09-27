import { withProps, compose } from 'recompose';
import { injectIntl } from 'react-intl';
import moment from 'moment';

const getData = (loans = []) => {
  const dates = loans.map(({ createdAt }) =>
    moment(createdAt).format('YYYY-M-D'));
  const filteredDates = dates
    .filter((date, index, self) => self.indexOf(date) === index)
    .sort((a, b) => new Date(b) - new Date(a));
  const loansByDate = filteredDates.reduce(
    (sortedLoans, date) => ({
      ...sortedLoans,
      [date]: loans.filter(({ createdAt }) =>
        moment(moment(createdAt).format('YYYY-M-D')).isSameOrBefore(date)).length,
    }),
    {},
  );
  return Object.keys(loansByDate).map(date => [
    moment.utc(moment(date).format('YYYY-MM-DD')).valueOf(),
    loansByDate[date],
  ]);
};

const getConfig = (loans = []) => ({
  chart: {
    type: 'line',
  },
  credits: { enabled: false },
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
    },
  },
  series: [
    {
      name: 'Clients',
      data: getData(loans),
    },
  ],
});

export default compose(
  injectIntl,
  withProps(({ intl: { formatMessage }, loans = [] }) => ({
    config: getConfig(loans),
    data: getData(loans),
  })),
);
