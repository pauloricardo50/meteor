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

const getConfig = (lines) => {
  const points = lines.reduce(
    (allPoints, { data }) => [...allPoints, ...data.map(x => x[1])],
    [],
  );

  const maxY = Math.max(...points) + 0.1;

  return {
    xAxis: {
      type: 'datetime',
      title: { text: 'Date' },
    },
    yAxis: {
      title: { text: 'Taux moyens [%]' },
      min: 0,
      max: maxY,
      tickInterval: 0.1,
    },
    chart: { type: 'line', height: 800 },
    plotOptions: { spline: { marker: { enabled: true } } },
    tooltip: {
      headerFormat: '<b>{point.x:%d.%m.%y}</b><br>',
      pointFormat: '{series.name}: {point.y:.2f}%<br>',
      crosshairs: true,
      shared: true,
    },
  };
};

const getAllRatesOfType = ({ interestRates, type }) =>
  interestRates
    .map(rates => [
      moment.utc(rates.date).valueOf(),
      getAverageRate(rates[type]),
    ])
    .filter(rate => rate[1]);

const getLines = interestRates =>
  Object.values(INTEREST_RATES).map(type => ({
    name: formatMessage(`InterestsTable.${type}`),
    data: getAllRatesOfType({ interestRates, type }),
  }));

export default compose(
  injectIntl,
  withProps(({ interestRates }) => {
    const lines = getLines(interestRates);
    return {
      title: "Taux d'intérêt",
      lines,
      config: getConfig(lines),
    };
  }),
);
