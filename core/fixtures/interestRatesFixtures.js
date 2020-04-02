import moment from 'moment';

import { getRandomInterestRate } from '../api/interestRates/fakes';
import { INTEREST_RATES } from '../api/interestRates/interestRatesConstants';
import InterestRatesService from '../api/interestRates/server/InterestRatesService';

const FAKE_INTEREST_RATES_MEANS = {
  [INTEREST_RATES.LIBOR]: 0.8,
  [INTEREST_RATES.YEARS_1]: 1.1,
  [INTEREST_RATES.YEARS_2]: 1.5,
  [INTEREST_RATES.YEARS_5]: 1.9,
  [INTEREST_RATES.YEARS_10]: 2.3,
  [INTEREST_RATES.YEARS_15]: 2.7,
  [INTEREST_RATES.YEARS_20]: 3,
  [INTEREST_RATES.YEARS_25]: 3.4,
};

const fakeInterestRates = () =>
  Object.values(INTEREST_RATES).reduce(
    (rates, type) => ({
      ...rates,
      [type]: getRandomInterestRate(FAKE_INTEREST_RATES_MEANS[type]),
    }),
    {},
  );

export const createFakeInterestRates = ({ number }) => {
  let dates = [];

  for (let i = 0; i < number; i += 1) {
    dates = [
      ...dates,
      moment()
        .subtract(i, 'd')
        .toDate(),
    ];
  }

  const fakeRates = dates.map(date => ({
    date,
    ...fakeInterestRates(),
  }));

  fakeRates.forEach(rate => InterestRatesService.insert(rate));
};
