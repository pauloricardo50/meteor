/* eslint-env mocha */
import { expect } from 'chai';
import moment from 'moment';

import { resetDatabase } from '../../../../utils/testHelpers';
import generator from '../../../factories/server';
import { INTEREST_RATES, TRENDS } from '../../interestRatesConstants';
import { currentInterestRates } from '../../queries';

describe('currentInterestRates', () => {
  beforeEach(() => {
    resetDatabase();
  });

  it('fetches the correct rates', () => {
    generator({
      interestRates: [
        {
          date: moment()
            .subtract(1, 'day')
            .toDate(),
          interest10: {
            rateLow: 0.1,
            rateHigh: 0.1,
            trend: TRENDS.DOWN,
          },
        },
        {
          date: moment().toDate(),
          interest10: {
            rateLow: 0.2,
            rateHigh: 0.2,
            trend: TRENDS.DOWN,
          },
        },
        {
          date: moment()
            .add(1, 'day')
            .toDate(),
          interest10: {
            rateLow: 0.3,
            rateHigh: 0.3,
            trend: TRENDS.DOWN,
          },
        },
      ],
    });

    const { rates } = currentInterestRates.fetch();
    const { rateLow } = rates.find(
      ({ type }) => type === INTEREST_RATES.YEARS_10,
    );

    expect(rateLow).to.equal(0.2);
  });
});
