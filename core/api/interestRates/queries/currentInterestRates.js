import moment from 'moment';
import InterestRates from '../interestRates';
import { currentInterestRatesFragment } from './interestRatesFragments';
import {
  INTEREST_RATES_QUERIES,
  INTEREST_RATES,
} from '../interestRatesConstants';

export default InterestRates.createQuery(
  INTEREST_RATES_QUERIES.CURRENT_INTEREST_RATES,
  {
    $filter({ filters }) {
      filters.date = {
        $lte: moment().toDate(),
      };
    },
    ...currentInterestRatesFragment,
    $options: { sort: { date: -1 }, limit: 1 },
    $postFilter(results) {
      const interestRates = results.length > 0 && results[0];
      const cleanedRates = Object.keys(interestRates)
        .filter(type =>
          interestRates[type].rateLow
            && interestRates[type].rateHigh
            && interestRates[type].trend)
        .map(type => ({
          type,
          rateLow: interestRates[type].rateLow,
          rateHigh: interestRates[type].rateHigh,
          trend: interestRates[type].trend,
        }))
        .sort(({ type: a }, { type: b }) =>
          Object.values(INTEREST_RATES).indexOf(a)
            - Object.values(INTEREST_RATES).indexOf(b));

      const averageRates = cleanedRates.reduce(
        (avgRates, { type, rateLow, rateHigh }) => ({
          ...avgRates,
          [type]: (rateLow + rateHigh) / 2,
        }),
        {},
      );

      return { rates: cleanedRates, averageRates, date: interestRates.date };
    },
  },
);
