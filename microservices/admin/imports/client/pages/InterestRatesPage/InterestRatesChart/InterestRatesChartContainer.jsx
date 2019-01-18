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

const formatDate = date =>
  moment.utc(moment(date).format('YYYY-MM-DD')).valueOf();

const getData = ({ rates, dataType }) => {
  switch (dataType) {
  case 'average':
    return rates.reduce(
      (data, rate) => [
        ...data,
        [formatDate(rate.date), getAverageRate(rate)],
      ],
      [],
    );
  case 'range':
    return rates.reduce(
      (data, rate) => [
        ...data,
        [formatDate(rate.date), 100 * rate.rateLow, 100 * rate.rateHigh],
      ],
      [],
    );
  default:
    return [];
  }
};

const getAllRatesOfTypeLines = ({ rates, type }) =>
  rates.length && [
    {
      name: formatMessage(`InterestsChart.${type}.average`),
      data: getData({ rates, dataType: 'average' }),
      zIndex: 1,
    },
    {
      name: formatMessage(`InterestsChart.${type}.range`),
      data: getData({ rates, dataType: 'range' }),
      type: 'arearange',
      zIndex: 0,
      fillOpacity: 0.2,
      lineWidth: 0,
      marker: { enabled: false },
      visible: false,
    },
  ];

const getAllRatesOfType = ({ interestRates, type }) =>
  interestRates
    .map((rates) => {
      const { date } = rates;
      const rate = rates[type];

      if (rate && date) {
        const { rateLow, rateHigh } = rate;
        return rateLow && rateHigh ? { date, rateLow, rateHigh } : null;
      }

      return null;
    })
    .filter(x => x);

const shouldDisplayInterestRatesOfType = ({ interestRates, type }) =>
  interestRates.some(rate => Object.keys(rate[type]).length > 0);

const getInterestRateLines = interestRates =>
  Object.values(INTEREST_RATES)
    .reduce((lines, type) => {
      if (!shouldDisplayInterestRatesOfType({ interestRates, type })) {
        return lines;
      }

      const rates = getAllRatesOfType({ interestRates, type });
      return [...lines, ...getAllRatesOfTypeLines({ rates, type })];
    }, [])
    .filter(x => x);

const getIrs10yLine = irs10y =>
  irs10y.length > 0 && {
    name: formatMessage('Irs10y.name'),
    data: irs10y.map(({ date, rate }) => [formatDate(date), 100 * rate]),
    visible: false,
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
