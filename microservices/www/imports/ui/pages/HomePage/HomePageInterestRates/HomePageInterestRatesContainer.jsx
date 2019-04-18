import { withProps } from 'recompose';
import {
  INTEREST_RATES,
  INTEREST_TREND,
} from 'core/api/interestRates/interestRatesConstants';

export default component =>
  withProps(() => ({
    rates: [
      {
        type: INTEREST_RATES.LIBOR,
        low: 0.0075,
        high: 0.0089,
        trend: INTEREST_TREND.UP,
      },
      {
        type: INTEREST_RATES.YEARS_2,
        low: 0.0105,
        high: 0.0124,
        trend: INTEREST_TREND.DOWN,
      },
      {
        type: INTEREST_RATES.YEARS_5,
        low: 0.0117,
        high: 0.0136,
        trend: INTEREST_TREND.UP,
      },
      {
        type: INTEREST_RATES.YEARS_10,
        low: 0.0144,
        high: 0.0178,
        trend: INTEREST_TREND.DOWN,
      },
    ],
  }))(component);
