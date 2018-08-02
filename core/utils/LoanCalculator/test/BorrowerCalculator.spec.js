// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import BorrowerCalculator from '../BorrowerCalculator';

describe('BorrowerCalculator', () => {
  describe('sumValues', () => {
    it('sums values with a single key', () => {
      expect(BorrowerCalculator.sumValues({
        borrowers: [{ a: 1 }, { a: 2 }],
        keys: 'a',
      })).to.equal(3);
    });

    it('sums values with multiple keys', () => {
      expect(BorrowerCalculator.sumValues({
        borrowers: [{ a: 1, b: 4 }, { a: 2, b: 3 }],
        keys: ['a', 'b'],
      })).to.equal(10);
    });
    it('omits keys if they are not provided', () => {
      expect(BorrowerCalculator.sumValues({ borrowers: [{ a: 1 }, {}], keys: 'a' })).to.equal(1);
    });
  });
});
