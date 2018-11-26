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
    rateLow: 0.0057,
    rateHigh: 0.01,
    trend: TRENDS.FLAT,
  },
  {
    type: INTEREST_RATES.YEARS_5,
    rateLow: 0.008,
    rateHigh: 0.012,
    trend: TRENDS.DOWN,
  },
  {
    type: INTEREST_RATES.YEARS_10,
    rateLow: 0.012,
    rateHigh: 0.017,
    trend: TRENDS.DOWN,
  },
  {
    type: INTEREST_RATES.YEARS_15,
    rateLow: 0.0173,
    rateHigh: 0.0213,
    trend: TRENDS.UP,
  },
  {
    type: INTEREST_RATES.YEARS_20,
    rateLow: 0.018,
    rateHigh: 0.024,
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
