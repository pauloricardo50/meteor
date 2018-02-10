/* eslint-env mocha */
import { expect } from 'chai';

import { arrayify } from '../general';

describe('general helpers', () => {
  describe('arrayify', () => {
    it('returns an array if given an array', () => {
      expect(arrayify([])).to.deep.equal([]);
    });

    it('returns an array if given nothing', () => {
      expect(arrayify()).to.deep.equal([]);
    });

    it('returns an array with a given value if value is not an array', () => {
      expect(arrayify({})).to.deep.equal([{}]);
      expect(arrayify('hello')).to.deep.equal(['hello']);
      expect(arrayify(1)).to.deep.equal([1]);
    });
  });
});
