// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import BorrowerUtils from '../BorrowerUtils';

describe('BorrowerUtils', () => {
  describe('sumValues', () => {
    it('sums values with a single key', () => {
      expect(BorrowerUtils.sumValues([{ a: 1 }, { a: 2 }], 'a')).to.equal(3);
    });

    it('sums values with multiple keys', () => {
      expect(BorrowerUtils.sumValues([{ a: 1, b: 4 }, { a: 2, b: 3 }], ['a', 'b'])).to.equal(10);
    });
    it('omits keys if they are not provided', () => {
      expect(BorrowerUtils.sumValues([{ a: 1 }, {}], 'a')).to.equal(1);
    });
  });
});
