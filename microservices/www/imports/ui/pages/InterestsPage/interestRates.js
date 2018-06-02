import { INTEREST_RATES } from 'core/api/constants';

export const TRENDS = {
  UP: 'UP',
  DOWN: 'DOWN',
  FLAT: 'FLAT',
};

const interestRates = [
  {
    type: INTEREST_RATES.LIBOR,
    rateLow: 0.0059,
    rateHigh: 0.012,
    trend: TRENDS.FLAT,
  },
  {
    type: INTEREST_RATES.YEARS_5,
    rateLow: 0.009,
    rateHigh: 0.0125,
    trend: TRENDS.DOWN,
  },
  {
    type: INTEREST_RATES.YEARS_10,
    rateLow: 0.0114,
    rateHigh: 0.0165,
    trend: TRENDS.DOWN,
  },
  {
    type: INTEREST_RATES.YEARS_15,
    rateLow: 0.0172,
    rateHigh: 0.021,
    trend: TRENDS.FLAT,
  },
  {
    type: INTEREST_RATES.YEARS_20,
    rateLow: 0.0185,
    rateHigh: 0.0224,
    trend: TRENDS.FLAT,
  },
  {
    type: INTEREST_RATES.YEARS_25,
    rateLow: 0.0192,
    rateHigh: 0.0232,
    trend: TRENDS.FLAT,
  },
];

export default interestRates;
