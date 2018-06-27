/* eslint-env mocha */
import { expect } from 'chai';
import { _ } from 'lodash';

import { arrayify, getPercent } from '../general';

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

  describe('getPercent', () => {
    it('returns 0 for an empty array', () => {
      expect(getPercent([])).to.equal(0);
    });

    it('returns 1 for a simple array', () => {
      expect(getPercent(['hello'])).to.equal(1);
    });

    it('returns 0 for a simple array with undefined', () => {
      expect(getPercent([undefined])).to.equal(0);
    });

    it('counts false values', () => {
      expect(getPercent([false])).to.equal(1);
    });

    it("doesn't count null values", () => {
      expect(getPercent([null])).to.equal(0);
    });

    it('returns 0.2 for an array with 10 values and 8 undefined values', () => {
      const array = _.times(10, 0);
      array[0] = true;
      array[1] = true;

      expect(getPercent(array)).to.equal(0.2);
    });

    it("throws an error if it isn't given an array", () => {
      expect(() => getPercent('hello')).to.throw();
    });

    it("returns 0 if it isn't given any argument", () => {
      expect(getPercent()).to.equal(0);
    });
  });
});
