import { INTEREST_RATES } from 'core/api/constants';

export const TRENDS = {
  UP: 'UP',
  DOWN: 'DOWN',
  FLAT: 'FLAT',
};

const interestRates = [
  {
    type: INTEREST_RATES.LIBOR,
    rateLow: 0.005,
    rateHigh: 0.01,
    trend: TRENDS.FLAT,
  },
  {
    type: INTEREST_RATES.YEARS_5,
    rateLow: 0.008,
    rateHigh: 0.0115,
    trend: TRENDS.DOWN,
  },
  {
    type: INTEREST_RATES.YEARS_10,
    rateLow: 0.0114,
    rateHigh: 0.0149,
    trend: TRENDS.FLAT,
  },
  {
    type: INTEREST_RATES.YEARS_15,
    rateLow: 0.016,
    rateHigh: 0.019,
    trend: TRENDS.DOWN,
  },
  {
    type: INTEREST_RATES.YEARS_20,
    rateLow: 0.0179,
    rateHigh: 0.022,
    trend: TRENDS.FLAT,
  },
  // {
  //   type: INTEREST_RATES.YEARS_25,
  //   rateLow: 0.0192,
  //   rateHigh: 0.0232,
  //   trend: TRENDS.FLAT,
  // },
];

export default interestRates;
