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
    trend: TRENDS.DOWN,
  },
  {
    type: INTEREST_RATES.YEARS_5,
    rateLow: 0.0085,
    rateHigh: 0.0116,
    trend: TRENDS.UP,
  },
  {
    type: INTEREST_RATES.YEARS_10,
    rateLow: 0.0109,
    rateHigh: 0.0145,
    trend: TRENDS.FLAT,
  },
  {
    type: INTEREST_RATES.YEARS_15,
    rateLow: 0.0162,
    rateHigh: 0.0218,
    trend: TRENDS.FLAT,
  },
  {
    type: INTEREST_RATES.YEARS_20,
    rateLow: 0.0179,
    rateHigh: 0.0227,
    trend: TRENDS.DOWN,
  },
  // {
  //   type: INTEREST_RATES.YEARS_25,
  //   rateLow: 0.0192,
  //   rateHigh: 0.0232,
  //   trend: TRENDS.FLAT,
  // },
];

export default interestRates;
