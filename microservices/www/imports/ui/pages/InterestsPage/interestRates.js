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
    rateHigh: 0.010,
    trend: TRENDS.FLAT,
  },
  {
    type: INTEREST_RATES.YEARS_5,
    rateLow: 0.0088,
    rateHigh: 0.0116,
    trend: TRENDS.FLAT,
  },
  {
    type: INTEREST_RATES.YEARS_10,
    rateLow: 0.0108,
    rateHigh: 0.0147,
    trend: TRENDS.UP,
  },
  {
    type: INTEREST_RATES.YEARS_15,
    rateLow: 0.0181,
    rateHigh: 0.0218,
    trend: TRENDS.UP,
  },
  {
    type: INTEREST_RATES.YEARS_20,
    rateLow: 0.0179,
    rateHigh: 0.0227,
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
