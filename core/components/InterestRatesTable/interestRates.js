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
    rateLow: 0.0099,
    rateHigh: 0.0129,
    trend: TRENDS.UP,
  },
  {
    type: INTEREST_RATES.YEARS_10,
    rateLow: 0.0119,
    rateHigh: 0.018,
    trend: TRENDS.UP,
  },
  {
    type: INTEREST_RATES.YEARS_15,
    rateLow: 0.0188,
    rateHigh: 0.0226,
    trend: TRENDS.UP,
  },
  {
    type: INTEREST_RATES.YEARS_20,
    rateLow: 0.0207,
    rateHigh: 0.0258,
    trend: TRENDS.UP,
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
