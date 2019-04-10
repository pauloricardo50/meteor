import { withProps, compose, withState } from 'recompose';
import { injectIntl } from 'react-intl';
import moment from 'moment';

import { INTEREST_RATES } from 'core/api/interestRates/interestRatesConstants';
import colors from 'core/config/colors';

const roundAndFormat = rate => Math.round(100000 * rate) / 1000;

const DEFAULT_DISABLED_LINES = [
  INTEREST_RATES.YEARS_1,
  INTEREST_RATES.YEARS_2,
  INTEREST_RATES.YEARS_20,
];

const getAverageRate = (rate) => {
  if (!rate || !rate.rateLow || !rate.rateHigh) {
    return null;
  }
  return roundAndFormat((rate.rateLow + rate.rateHigh) / 2);
};

const getConfig = ({ showRanges }) => ({
  xAxis: {
    type: 'datetime',
    title: { text: 'Date' },
  },
  yAxis: {
    title: { text: 'Taux [%]' },
    tickInterval: 0.1,
  },
  chart: { height: 800, zoomType: 'x' },
  tooltip: {
    crosshairs: true,
    shared: true,
    valueSuffix: '%',
  },
  plotOptions: {
    arearange: {
      visible: showRanges,
    },
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

const getAverageTypeData = ({ rates }) =>
  rates.reduce(
    (data, rate) => [...data, [formatDate(rate.date), getAverageRate(rate)]],
    [],
  );

const getRangeTypeData = ({ rates }) =>
  rates.reduce(
    (data, rate) => [
      ...data,
      [
        formatDate(rate.date),
        roundAndFormat(rate.rateLow),
        roundAndFormat(rate.rateHigh),
      ],
    ],
    [],
  );

const getData = ({ rates, dataType }) => {
  switch (dataType) {
  case 'average':
    return getAverageTypeData({ rates });
  case 'range':
    return getRangeTypeData({ rates });
  default:
    return [];
  }
};

const getAllRatesOfTypeLines = ({ rates, type, formatMessage }) =>
  rates.length && [
    {
      name: formatMessage({ id: `InterestsChart.${type}.average` }),
      data: getData({ rates, dataType: 'average' }),
      zIndex: 1,
      color: colors.interestRates[type],
      marker: {
        fillColor: 'white',
        lineWidth: 2,
        lineColor: colors.interestRates[type],
        symbol: 'circle',
      },
      visible: !DEFAULT_DISABLED_LINES.includes(type),
    },
    {
      name: formatMessage({ id: `InterestsChart.${type}.range` }),
      data: getData({ rates, dataType: 'range' }),
      type: 'arearange',
      zIndex: 0,
      fillOpacity: 0.2,
      lineWidth: 0,
      color: colors.interestRates[type],
      marker: { enabled: false },
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

const getInterestRateLines = (interestRates, formatMessage) =>
  Object.values(INTEREST_RATES)
    .reduce((lines, type) => {
      if (!shouldDisplayInterestRatesOfType({ interestRates, type })) {
        return lines;
      }

      const rates = getAllRatesOfType({ interestRates, type });
      return [...lines, ...getAllRatesOfTypeLines({ rates, type, formatMessage })];
    }, [])
    .filter(x => x);

const getIrs10yLine = (irs10y, formatMessage) =>
  irs10y.length > 0 && {
    name: formatMessage({ id: 'Irs10y.name' }),
    data: irs10y.map(({ date, rate }) => [
      formatDate(date),
      roundAndFormat(rate),
    ]),
    zIndex: 1,
    color: colors.interestRates.irs10y,
    marker: {
      fillColor: 'white',
      lineWidth: 2,
      lineColor: colors.interestRates.irs10y,
      symbol: 'circle',
    },
  };

const getLines = ({ interestRates, irs10y, formatMessage }) =>
  [
    ...getInterestRateLines(interestRates, formatMessage),
    getIrs10yLine(irs10y, formatMessage),
  ].filter(x => x);

export default compose(
  injectIntl,
  withState('showRanges', 'setShowRanges', false),
  withProps(({
    interestRates = [],
    irs10y = [],
    showRanges,
    setShowRanges,
    intl: { formatMessage },
  }) => {
    const lines = getLines({
      interestRates,
      irs10y,
      showRanges,
      formatMessage,
    });
    
    return {
      title: "Taux d'intérêt",
      lines,
      config: getConfig({ showRanges }),
      toggleRanges: () => setShowRanges(!showRanges),
    };
  }),
);
