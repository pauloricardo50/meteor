import { withProps, compose } from 'recompose';
import { injectIntl } from 'react-intl';
import moment from 'moment';

import formatMessage from 'core/utils/intl';
import { INTEREST_RATES } from 'core/api/interestRates/interestRatesConstants';

const getAverageRate = (rate) => {
  if (!rate || !rate.rateLow || !rate.rateHigh) {
    return null;
  }
  return (100 * (rate.rateLow + rate.rateHigh)) / 2;
};

const getConfig = () => ({
  xAxis: {
    type: 'datetime',
    title: { text: 'Date' },
  },
  yAxis: {
    title: { text: 'Taux moyens [%]' },
    min: 0,
    tickInterval: 0.1,
  },
  chart: { type: 'line', height: 800, zoomType: 'x' },
  plotOptions: { spline: { marker: { enabled: true } } },
  tooltip: {
    headerFormat: '<b>{point.x:%d.%m.%y}</b><br>',
    pointFormat: '{series.name}: {point.y:.2f}%<br>',
    crosshairs: true,
    shared: true,
  },
});

const formatDate = date =>
  moment.utc(moment(date).format('YYYY-MM-DD')).valueOf();

const getAllRatesOfType = ({ interestRates, type }) =>
  interestRates
    .map(rates => [formatDate(rates.date), getAverageRate(rates[type])])
    .filter(rate => rate[1]);

const shouldDisplayInterestRatesOfType = ({ interestRates, type }) =>
  interestRates.some(rate => Object.keys(rate[type]).length > 0);

const getInterestRateLines = interestRates =>
  Object.values(INTEREST_RATES).map(type =>
    shouldDisplayInterestRatesOfType({ interestRates, type }) && {
      name: formatMessage(`InterestsTable.${type}`),
      data: getAllRatesOfType({ interestRates, type }),
    });

const getIrs10yLine = irs10y =>
  irs10y.length > 0 && {
    name: formatMessage('Irs10y.name'),
    data: irs10y.map(({ date, rate }) => [formatDate(date), 100 * rate]),
  };

const getLines = ({ interestRates, irs10y }) =>
  [...getInterestRateLines(interestRates), getIrs10yLine(irs10y)].filter(x => x);

export default compose(
  injectIntl,
  withProps(({ interestRates = [], irs10y = [] }) => {
    const lines = getLines({ interestRates, irs10y });
    return {
      title: "Taux d'intérêt",
      lines,
      config: getConfig(),
    };
  }),
);
