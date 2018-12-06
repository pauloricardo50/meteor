import { INTEREST_RATES } from '../../interestRatesConstants';

const singleInterestRateFragment = type => ({
  [type]: { rateLow: 1, rateHigh: 1, trend: 1 },
});

const ratesFragments = Object.values(INTEREST_RATES).reduce(
  (interestRates, type) => ({
    ...interestRates,
    ...singleInterestRateFragment(type),
  }),
  {},
);

export const interestRatesFragment = {
  createdAt: 1,
  updatedAt: 1,
  date: 1,
  ...ratesFragments,
};

export const currentInterestRatesFragment = {
  date: 1,
  ...ratesFragments,
};
