import { INTEREST_RATES } from 'core/api/constants';

export const TRENDS = {
  UP: 'UP',
  DOWN: 'DOWN',
  FLAT: 'FLAT',
};

const interestRates = [
  {
    type: INTEREST_RATES.LIBOR,
    rateLow: 0.0085,
    rateHigh: 0.0115,
    trend: TRENDS.UP,
  },
  {
    type: INTEREST_RATES.YEARS_5,
    rateLow: 0.012,
    rateHigh: 0.015,
    trend: TRENDS.DOWN,
  },
  {
    type: INTEREST_RATES.YEARS_10,
    rateLow: 0.0126,
    rateHigh: 0.0174,
    trend: TRENDS.FLAT,
  },
  {
    type: INTEREST_RATES.YEARS_15,
    rateLow: 0.018,
    rateHigh: 0.021,
    trend: TRENDS.UP,
  },
];

export default interestRates;
