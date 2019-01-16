import { withProps, compose } from 'recompose';
import { injectIntl } from 'react-intl';
import moment from 'moment';

import formatMessage from 'core/utils/intl';

const getConfig = () => ({
  xAxis: {
    type: 'datetime',
    title: { text: 'Date' },
  },
  yAxis: {
    title: { text: 'Taux [%]' },
    min: 0,
    tickInterval: 0.1,
  },
  chart: { height: 800, zoomType: 'x' },
  tooltip: {
    crosshairs: true,
    shared: true,
    valueSuffix: '%',
  },
  exporting: { enabled: true, width: 1200, scale: 1 },
});

const getRatesOfMonth = ({ rates, month, year }) =>
  rates.filter(({ date }) =>
    moment(date).format('MM') === month
      && moment(date).format('YYYY') === year);

const getAllMonths = ({ rates }) =>
  rates.reduce((months, rate) => {
    const { date } = rate;
    const rateMonth = moment(date).format('MM');
    const rateYear = moment(date).format('YYYY');

    if (
      !months.find(({ month, year }) => month === rateMonth && year === rateYear)
    ) {
      return [...months, { month: rateMonth, year: rateYear }];
    }

    return months;
  }, []);

const roundAndFormat = rate => Math.round(rate * 100000) / 1000;

const findMinRate = rates =>
  roundAndFormat(rates.reduce((min, { rate }) => (rate < min ? rate : min), 100));
const findMaxRate = rates =>
  roundAndFormat(rates.reduce((max, { rate }) => (rate > max ? rate : max), 0));

const getLines = ({ irs10y }) => {
  const allMonths = getAllMonths({ rates: irs10y });
  const rates = allMonths.map(({ month, year }) => {
    const ratesOfMonth = getRatesOfMonth({ rates: irs10y, month, year });
    const min = findMinRate(ratesOfMonth);
    const max = findMaxRate(ratesOfMonth);
    const date = new Date(parseInt(year), parseInt(month) - 1).valueOf();
    const average = Math.round(((min + max) / 2) * 100) / 100;
    return {
      date,
      min,
      max,
      average,
    };
  });
  return (
    irs10y.length && [
      {
        name: formatMessage('Irs10y.name.average'),
        data: rates.reduce(
          (data, rate) => [...data, [rate.date, rate.average]],
          [],
        ),
        zIndex: 1,
        color: 'red',
        marker: {
          fillColor: 'white',
          lineWidth: 2,
          lineColor: 'red',
        },
      },
      {
        name: formatMessage('Irs10y.name.range'),
        data: rates.reduce(
          (data, rate) => [...data, [rate.date, rate.min, rate.max]],
          [],
        ),
        type: 'arearange',
        zIndex: 0,
        fillOpacity: 0.3,
        lineWidth: 0,
        marker: {
          enabled: false,
        },
      },
    ]
  );
};

export default compose(
  injectIntl,
  withProps(({ irs10y = [] }) => {
    const lines = getLines({ irs10y });
    return {
      title: "Moyenne mensuelle de l'IRS 10 ans",
      lines,
      config: getConfig(),
    };
  }),
);
