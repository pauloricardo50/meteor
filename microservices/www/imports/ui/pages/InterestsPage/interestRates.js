import { INTEREST_RATES } from 'core/api/constants';

export const TRENDS = {
  UP: 'UP',
  DOWN: 'DOWN',
  FLAT: 'FLAT',
};

const interestRates = [
  {
    type: INTEREST_RATES.LIBOR,
    rateLow: 0.006,
    rateHigh: 0.012,
    trend: TRENDS.FLAT,
  },
  {
    type: INTEREST_RATES.YEARS_5,
    rateLow: 0.0092,
    rateHigh: 0.0138,
    trend: TRENDS.UP,
  },
  {
    type: INTEREST_RATES.YEARS_10,
    rateLow: 0.0125,
    rateHigh: 0.0178,
    trend: TRENDS.UP,
  },
  {
    type: INTEREST_RATES.YEARS_15,
    rateLow: 0.0178,
    rateHigh: 0.0222,
    trend: TRENDS.UP,
  },
  {
    type: INTEREST_RATES.YEARS_20,
    rateLow: 0.0187,
    rateHigh: 0.0224,
    trend: TRENDS.FLAT,
  },
  {
    type: INTEREST_RATES.YEARS_25,
    rateLow: 0.0189,
    rateHigh: 0.0228,
    trend: TRENDS.FLAT,
  },
];

export default interestRates;
