// @flow
import { INTEREST_RATES } from 'core/api/constants';

export const TRENDS = {
  UP: 'UP',
  DOWN: 'DOWN',
  FLAT: 'FLAT',
};

const interestRates = [
  {
    type: INTEREST_RATES.LIBOR,
    rateLow: 0.0058,
    rateHigh: 0.01,
    trend: TRENDS.FLAT,
  },
  {
    type: INTEREST_RATES.YEARS_5,
    rateLow: 0.009,
    rateHigh: 0.0123,
    trend: TRENDS.FLAT,
  },
  {
    type: INTEREST_RATES.YEARS_10,
    rateLow: 0.0126,
    rateHigh: 0.0172,
    trend: TRENDS.FLAT,
  },
  {
    type: INTEREST_RATES.YEARS_15,
    rateLow: 0.0182,
    rateHigh: 0.021,
    trend: TRENDS.FLAT,
  },
  {
    type: INTEREST_RATES.YEARS_20,
    rateLow: 0.02,
    rateHigh: 0.0245,
    trend: TRENDS.FLAT,
  },
  // {
  //   type: INTEREST_RATES.YEARS_25,
  //   rateLow: 0.0192,
  //   rateHigh: 0.0232,
  //   trend: TRENDS.FLAT,
  // },
];

export const averageRates = interestRates.reduce(
  (rates, { type, rateLow, rateHigh }) => ({
    ...rates,
    [type]: (rateLow + rateHigh) / 2,
  }),
  {},
);

export default interestRates;
