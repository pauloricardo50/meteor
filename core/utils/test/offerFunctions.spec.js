/* eslint-env mocha */
import { expect } from 'chai';

import { getBestRate } from '../offerFunctions';

describe('offerFunctions', () => {
  describe('getBestRate', () => {
    it('returns the best rate', () => {
      const offers = [
        { standardOffer: { interest10: 10 } },
        { standardOffer: { interest10: 20 } },
      ];

      expect(getBestRate({ offers })).to.equal(10);
    });

    it('returns undefined if no offers are given', () => {
      expect(getBestRate({ offers: [] })).to.equal(undefined);
    });

    it('works with counterpart offers', () => {
      const offers = [
        { standardOffer: { interest10: 10 } },
        {
          standardOffer: { interest10: 20 },
          counterpartOffer: { interest10: 5 },
        },
      ];

      expect(getBestRate({ offers })).to.equal(5);
    });
  });
});
