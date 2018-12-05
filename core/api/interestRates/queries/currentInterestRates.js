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
  },
);
