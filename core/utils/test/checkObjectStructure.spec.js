/* eslint-env mocha */
import { expect } from 'chai';

import { makeCheckObjectStructure, testErrors } from '../checkObjectStructure';

const checkObjectStructure = makeCheckObjectStructure(testErrors);

describe.only('checkObjectStructure', () => {
  describe('does not throw when object matches the template', () => {
    it('with a single key string', () => {
      const template = { a: 1 };
      const obj = { a: 'hello' };

      expect(() => checkObjectStructure({ obj, template })).to.not.throw();
    });

    it('with a single key number', () => {
      const template = { a: 1 };
      const obj = { a: 12 };

      expect(() => checkObjectStructure({ obj, template })).to.not.throw();
    });

    it('with a single key empty array that can be empty', () => {
      const template = { a: [] };
      const obj = { a: [] };

      expect(() => checkObjectStructure({ obj, template })).to.not.throw();
    });

    it('with a single key array that can be empty', () => {
      const template = { a: [] };
      const obj = { a: [1, 2, 3] };

      expect(() => checkObjectStructure({ obj, template })).to.not.throw();
    });

    it('with a single key array that cannot be empty', () => {
      const template = { a: [1] };
      const obj = { a: [1, 2, 3] };

      expect(() => checkObjectStructure({ obj, template })).to.not.throw();
    });

    it('with a single key array that contains objects', () => {
      const template = { a: [{ b: 1, c: [], d: { e: 1, f: 1 } }] };
      const obj = {
        a: [
          {
            b: 'hello',
            c: [],
            d: { e: 123, f: 456 },
          },
          {
            b: 'hola',
            c: [1, 2, 3],
            d: { e: 123, f: 456 },
          },
        ],
      };

      expect(() => checkObjectStructure({ obj, template })).to.not.throw();
    });

    it('with a single key object', () => {
      const template = { a: { b: 1 } };
      const obj = { a: { b: 'hello' } };

      expect(() => checkObjectStructure({ obj, template })).to.not.throw();
    });

    it('with several keys and nested objects', () => {
      const template = {
        a: 1,
        b: [],
        c: [1],
        d: { e: 1, f: [], g: [1], h: { i: 1, j: 1 } },
      };
      const obj = {
        a: 'hello',
        b: [1, 2, 3],
        c: [1, 2, 3],
        d: { e: 12, f: [], g: ['hello'], h: { i: 123, j: 'hello' } },
      };

      expect(() => checkObjectStructure({ obj, template })).to.not.throw();
    });
  });

  describe('throws when the object does not match the template', () => {
    it('with a key missing', () => {
      const template = { abc: 1 };
      const obj = {};

      expect(() => checkObjectStructure({ obj, template })).to.throw('Missing key abc from object');
    });

    it('with a key that is undefined', () => {
      const template = { abc: 1 };
      const obj = { abc: undefined };

      expect(() => checkObjectStructure({ obj, template })).to.throw('Missing key abc from object');
    });

    it('with a key that is expected to be an array but is not', () => {
      const template = { abc: [] };
      const obj = { abc: 2 };

      expect(() => checkObjectStructure({ obj, template })).to.throw('Object key abc must be an array');
    });

    it('with a key that is expected to be a non-empty array but is empty', () => {
      const template = { abc: [1] };
      const obj = { abc: [] };

      expect(() => checkObjectStructure({ obj, template })).to.throw('Array at object key abc should not be empty');
    });

    it('with a non matching object in array', () => {
      const template = { a: [{ b: 1, c: [], d: { e: 1, f: 1 } }] };
      const obj = {
        a: [
          {
            b: 'hello',
            c: [],
            d: { e: 123, f: 456 },
          },
          {
            b: 'hola',
            d: { e: 123, f: 456 },
          },
        ],
      };

      expect(() => checkObjectStructure({ obj, template })).to.throw('Missing key c from object');
    });

    it('with a key that is expected to be an object but is not', () => {
      const template = { abc: {} };
      const obj = { abc: [] };

      expect(() => checkObjectStructure({ obj, template })).to.throw('Object key abc must be an object');
    });

    it('says which parent object a key should be in', () => {
      const template = { abc: { efg: 1 } };
      const obj = { abc: {} };

      expect(() => checkObjectStructure({ obj, template })).to.throw('Missing key efg from object abc');
    });
  });
});
