import moment from 'moment';

import { currentInterestRates } from '../../fragments';
import InterestRates from '../interestRates';
import {
  INTEREST_RATES_QUERIES,
  INTEREST_RATES,
} from '../interestRatesConstants';

const makeCheckRate = rates => type =>
  rates[type].rateLow && rates[type].rateHigh && rates[type].trend;

const makeFormatRate = rates => type => ({
  type,
  rateLow: rates[type].rateLow,
  rateHigh: rates[type].rateHigh,
  trend: rates[type].trend,
});

const sortRates = ({ type: a }, { type: b }) =>
  Object.values(INTEREST_RATES).indexOf(a)
  - Object.values(INTEREST_RATES).indexOf(b);

const getAverageRates = rates =>
  rates.reduce(
    (avgRates, { type, rateLow, rateHigh }) => ({
      ...avgRates,
      [type]: (rateLow + rateHigh) / 2,
    }),
    {},
  );

export default InterestRates.createQuery(
  INTEREST_RATES_QUERIES.CURRENT_INTEREST_RATES,
  {
    $filter({ filters }) {
      filters.date = {
        $lte: moment().toDate(),
      };
    },
    $options: { sort: { date: -1 }, limit: 1 },
    $postFilter(results) {
      const interestRates = results.length > 0 && results[0];
      const cleanedRates = Object.keys(interestRates)
        .filter(makeCheckRate(interestRates))
        .map(makeFormatRate(interestRates))
        .sort(sortRates);
      const averageRates = getAverageRates(cleanedRates);

      return { rates: cleanedRates, averageRates, date: interestRates.date };
    },
    ...currentInterestRates(),
  },
);
