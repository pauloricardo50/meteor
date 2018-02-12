import { withProps } from 'recompose';
import * as constants from 'core/api/constants';

export default component =>
    withProps(() => ({
        rates: [
            {
                type: constants.INTEREST_RATES.LIBOR,
                low: 0.0075,
                high: 0.0089,
                trend: constants.INTEREST_TREND.UP
            },
            {
                type: constants.INTEREST_RATES.YEARS_2,
                low: 0.0105,
                high: 0.0124,
                trend: constants.INTEREST_TREND.DOWN
            },
            {
                type: constants.INTEREST_RATES.YEARS_5,
                low: 0.0117,
                high: 0.0136,
                trend: constants.INTEREST_TREND.UP
            },
            {
                type: constants.INTEREST_RATES.YEARS_10,
                low: 0.0144,
                high: 0.0178,
                trend: constants.INTEREST_TREND.DOWN
            }
        ]
    }))(component);
