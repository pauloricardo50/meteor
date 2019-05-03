/* eslint-env mocha */
import { expect } from 'chai';

import { arePathsUnequal } from '../reactFunctions';

describe('reactFunctions', () => {
  describe('arePathsUnequal', () => {
    it('returns true or false if paths are unequal', () => {
      const func = arePathsUnequal(['a']);
      expect(func({ a: 1 }, { a: 2 })).to.equal(true);
      expect(func({ a: 1 }, { a: 1 })).to.equal(false);
    });

    it('does not fail with nested objects', () => {
      const func = arePathsUnequal(['a.b']);
      expect(func({ a: 1 }, { a: { b: 1 } })).to.equal(true);
      expect(func({ a: 1 }, { a: 1 })).to.equal(false);
      expect(func({ a: { b: 1 } }, { a: { b: 1 } })).to.equal(false);
    });

    it('compares arrays', () => {
      const func = arePathsUnequal(['a']);
      expect(func({ a: [1] }, { a: [1] })).to.equal(false);
      expect(func({ a: [1] }, { a: [] })).to.equal(true);
    });

    it('throws if trying to compare objects', () => {
      const func = arePathsUnequal(['a']);
      expect(() => func({ a: {} }, { a: {} })).to.throw('Should not');
    });

    it('works if one value is null', () => {
      const func = arePathsUnequal(['a']);
      expect(func({ a: null }, { a: 2 })).to.equal(true);
      expect(func({ a: 2 }, { a: null })).to.equal(true);
    });
  });
});
