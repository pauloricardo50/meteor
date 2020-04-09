/* eslint-env mocha */
import { expect } from 'chai';
import times from 'lodash/times';

import {
  arrayify,
  getAggregatePercent,
  getPercent,
  normalize,
} from '../general';

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
    it('returns 1 for an empty array', () => {
      expect(getPercent([])).to.equal(1);
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
      const array = times(10, () => undefined);
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

    it('returns 1 if it is given an empty array', () => {
      // Empty array means that there was nothing to do, so it should be 100%
      expect(getPercent([])).to.equal(1);
    });
  });

  describe('getAggregatePercent', () => {
    it('calculates the true progress based on count', () => {
      expect(
        getAggregatePercent([
          { percent: 0.1, count: 10 },
          { percent: 0.4, count: 20 },
        ]),
      ).to.deep.equal({ count: 30, percent: 0.3 });
    });

    it('returns 0 for empty arrays', () => {
      expect(getAggregatePercent([])).to.deep.equal({
        count: 0,
        percent: 0,
      });
    });

    it('returns the same value for a single object', () => {
      expect(getAggregatePercent([{ percent: 0.1, count: 10 }])).to.deep.equal({
        count: 10,
        percent: 0.1,
      });
    });
  });

  describe('normalize', () => {
    it('transforms an array of objects into a normalized object', () => {
      expect(normalize([{ id: 1 }, { id: 2 }])).to.deep.equal({
        1: { id: 1 },
        2: { id: 2 },
      });
    });

    it('works with _id', () => {
      expect(normalize([{ _id: 1 }, { _id: 2 }])).to.deep.equal({
        1: { _id: 1 },
        2: { _id: 2 },
      });
    });
  });
});
