/* eslint-env mocha */
import { expect } from 'chai';

import { getBestRate } from '../loanInterestsTableHelpers';

describe('loanInterestsTableHelpers', () => {
  describe('getBestRate', () => {
    let offers;
    it('returns the min and max of a rate', () => {
      offers = [{ standardOffer: { a: 1 } }, { counterpartOffer: { a: 2 } }];

      expect(getBestRate(offers, 'a')).to.deep.equal({
        rateHigh: 2,
        rateLow: 1,
      });
    });

    it('returns the min and max of a rate', () => {
      offers = [
        { standardOffer: { a: 1 } },
        { counterpartOffer: { a: 2 } },
        { standardOffer: { a: 3 } },
        { counterpartOffer: { a: 4 } },
        { standardOffer: { a: 5 } },
        { counterpartOffer: { a: 6 } },
      ];

      expect(getBestRate(offers, 'a')).to.deep.equal({
        rateHigh: 6,
        rateLow: 1,
      });
    });
  });
});
