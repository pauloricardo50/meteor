import InterestRates from '../interestRates';
import { interestRatesFragment } from './interestRatesFragments';
import { INTEREST_RATES_QUERIES } from '../interestRatesConstants';

export default InterestRates.createQuery(
  INTEREST_RATES_QUERIES.INTEREST_RATES,
  {
    ...interestRatesFragment,
    $options: { sort: { date: -1 } },
  },
);
