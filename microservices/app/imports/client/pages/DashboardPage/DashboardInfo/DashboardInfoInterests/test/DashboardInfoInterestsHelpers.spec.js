/* eslint-env mocha */
import { expect } from 'chai';

import { getBestRate } from '../dashboardInfoInterestsHelpers';

describe('dashboardInfoInterestsHelpers', () => {
  describe('getBestRate', () => {
    let offers;
    it('returns the min and max of a rate', () => {
      offers = [{ a: 1 }, { a: 2 }];

      expect(getBestRate(offers, 'a')).to.deep.equal({
        rateHigh: 2,
        rateLow: 1,
      });
    });

    it('returns the min and max of a rate', () => {
      offers = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }, { a: 6 }];

      expect(getBestRate(offers, 'a')).to.deep.equal({
        rateHigh: 6,
        rateLow: 1,
      });
    });
  });
});
