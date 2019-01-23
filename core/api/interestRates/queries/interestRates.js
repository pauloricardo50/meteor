import { interestRates } from '../../fragments';
import InterestRates from '../interestRates';
import { INTEREST_RATES_QUERIES } from '../interestRatesConstants';

export default InterestRates.createQuery(
  INTEREST_RATES_QUERIES.INTEREST_RATES,
  {
    ...interestRates(),
    $options: { sort: { date: -1 } },
  },
);
