import moment from 'moment';
import InterestRates from '../interestRates';
import { currentInterestRatesFragment } from './interestRatesFragments';
import { INTEREST_RATES_QUERIES } from '../interestRatesConstants';

export default InterestRates.createQuery(
  INTEREST_RATES_QUERIES.CURRENT_INTEREST_RATES,
  {
    $filter({ filters, params }) {
      filters.date = {
        $lte: moment().toDate(),
      };
    },
    ...currentInterestRatesFragment,
    $options: { sort: { date: -1 }, limit: 1 },
    $postFilter(results, params) {
      const interestRates = results.length > 0 && results[0];
      const rates = Object.keys(interestRates)
        .filter(type =>
          interestRates[type].rateLow
            && interestRates[type].rateHigh
            && interestRates[type].trend)
        .map(type => ({
          type,
          rateLow: interestRates[type].rateLow,
          rateHigh: interestRates[type].rateHigh,
          trend: interestRates[type].trend,
        }));
      return { rates, date: interestRates.date };
    },
  },
);
