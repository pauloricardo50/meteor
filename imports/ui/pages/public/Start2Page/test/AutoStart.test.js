/* eslint-env mocha */
import { expect } from 'chai';

import { arrayIsTrue } from '../AutoStart.jsx';

describe('Auto Start', () => {
  describe('Array is true', () => {
    let keys = [];

    beforeEach(() => {
      keys = ['key1', 'key2'];
    });

    it('Should return true for a basic array', () => {
      const array = [{ key1: true, key2: true }];

      expect(arrayIsTrue(array, keys)).to.equal(true);
    });

    it('Should return false for a basic array', () => {
      const array = [{ key1: true, key2: undefined }];

      expect(arrayIsTrue(array, keys)).to.equal(false);
    });

    it('Should return false for a longerish array', () => {
      const array = [
        { key1: true, key2: true },
        { key1: true, key2: undefined },
      ];

      expect(arrayIsTrue(array, keys)).to.equal(false);
    });

    it('Should return true for a longer array', () => {
      const array = [
        { key1: true, key2: true },
        { key1: true, key2: true },
        { key1: true, key2: true },
      ];

      expect(arrayIsTrue(array, keys)).to.equal(true);
    });

    it('Should return false for a longer array', () => {
      const array = [
        { key1: true, key2: true },
        { key1: undefined, key2: true },
        { key1: true, key2: true },
      ];

      expect(arrayIsTrue(array, keys)).to.equal(false);
    });

    it('Should return false for a longer array with one more key', () => {
      keys.push('key3');
      const array = [
        { key1: true, key2: true },
        { key1: true, key2: true },
        { key1: true, key2: true },
      ];

      expect(arrayIsTrue(array, keys)).to.equal(false);
    });
  });
});
