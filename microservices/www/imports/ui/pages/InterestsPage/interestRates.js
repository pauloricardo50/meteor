import { INTEREST_RATES } from 'core/api/constants';

export const TRENDS = {
  UP: 'UP',
  DOWN: 'DOWN',
  FLAT: 'FLAT',
};

const interestRates = [
  {
    type: INTEREST_RATES.LIBOR,
    rateLow: 0.007,
    rateHigh: 0.012,
    trend: TRENDS.FLAT,
  },
  {
    type: INTEREST_RATES.YEARS_5,
    rateLow: 0.009,
    rateHigh: 0.0135,
    trend: TRENDS.FLAT,
  },
  {
    type: INTEREST_RATES.YEARS_10,
    rateLow: 0.0135,
    rateHigh: 0.0175,
    trend: TRENDS.UP,
  },
  {
    type: INTEREST_RATES.YEARS_15,
    rateLow: 0.017,
    rateHigh: 0.021,
    trend: TRENDS.UP,
  },
];

export default interestRates;
