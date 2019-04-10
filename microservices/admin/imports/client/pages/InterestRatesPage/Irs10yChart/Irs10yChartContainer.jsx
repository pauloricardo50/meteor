import { withProps, compose } from 'recompose';
import { injectIntl } from 'react-intl';
import moment from 'moment';

import colors from 'core/config/colors';

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
  exporting: {
    enabled: true,
    sourceWidth: 1200,
    sourceHeight: 800,
    width: 1200,
    height: 800,
    printMaxWidth: 1200,
    scale: 3,
  },
});

const getRatesOfMonth = ({ rates, month, year }) =>
  rates.filter(({ date }) =>
    moment(date).month() === month && moment(date).year() === year);

const getAllMonths = ({ rates }) =>
  rates.reduce((months, { date }) => {
    const rateMonth = moment(date).month();
    const rateYear = moment(date).year();

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

const getData = ({ formattedRates, type }) => {
  switch (type) {
  case 'average':
    return formattedRates.reduce(
      (data, rate) => [...data, [rate.date, rate.average]],
      [],
    );
  case 'range':
    return formattedRates.reduce(
      (data, rate) => [...data, [rate.date, rate.min, rate.max]],
      [],
    );
  default:
    return [];
  }
};

const getFormattedRates = ({ rates, allMonths }) =>
  allMonths.map(({ month, year }) => {
    const ratesOfMonth = getRatesOfMonth({ rates, month, year });
    const min = findMinRate(ratesOfMonth);
    const max = findMaxRate(ratesOfMonth);
    const date = moment({ year, month }).valueOf();
    const average = Math.round(((min + max) / 2) * 100) / 100;
    return { date, min, max, average };
  });

const getLines = ({ rates, formatMessage }) => {
  const allMonths = getAllMonths({ rates });
  const formattedRates = getFormattedRates({ rates, allMonths });
  return (
    rates.length && [
      {
        name: formatMessage({ id: 'Irs10y.name.average' }),
        data: getData({ formattedRates, type: 'average' }),
        zIndex: 1,
        color: colors.mui.darkPrimary,
        marker: {
          fillColor: 'white',
          lineWidth: 2,
          lineColor: colors.mui.darkPrimary,
        },
      },
      {
        name: formatMessage({ id: 'Irs10y.name.range' }),
        data: getData({ formattedRates, type: 'range' }),
        type: 'arearange',
        zIndex: 0,
        fillOpacity: 0.2,
        lineWidth: 0,
        color: colors.mui.darkPrimary,
        marker: { enabled: false },
      },
    ]
  );
};

export default compose(
  injectIntl,
  withProps(({ irs10y = [], intl: { formatMessage } }) => {
    const lines = getLines({ rates: irs10y, formatMessage });
    return {
      title: "Moyenne mensuelle de l'IRS 10 ans",
      lines,
      config: getConfig(),
    };
  }),
);
