/* eslint-env mocha */
import { expect } from 'chai';
import { _ } from 'lodash';

import {
  arrayify,
  getPercent,
  flattenObjectTreeToArrays,
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

  describe('flattenObjectTreeToArrays', () => {
    it("flattens an object tree into arrays of leaf's path & value", () => {
      const tree = {
        type: 1,
        assignedEmployee: { emails: [{ address: ['admin@email.com'] }] },
        user: { firtsName: 1 },
      };

      expect(flattenObjectTreeToArrays(tree)).to.deep.equal([
        { path: ['type'], value: 1 },
        {
          path: ['assignedEmployee', 'emails', '0', 'address'],
          value: ['admin@email.com'],
        },
        { path: ['user', 'firtsName'], value: 1 },
      ]);
    });

    it('flattens first-level branches', () => {
      const tree = { branch: 'leaf' };
      expect(flattenObjectTreeToArrays(tree)).to.deep.equal([
        { path: ['branch'], value: 'leaf' },
      ]);
    });

    it('flattens nested branches', () => {
      const tree = { key1: { key2: { key3: 1 } } };
      expect(flattenObjectTreeToArrays(tree)).to.deep.equal([
        { path: ['key1', 'key2', 'key3'], value: 1 },
      ]);
    });

    it('flattens branches that are non-empty objects', () => {
      const tree = { key1: { key2: 'leaf' } };
      expect(flattenObjectTreeToArrays(tree)).to.deep.equal([
        { path: ['key1', 'key2'], value: 'leaf' },
      ]);
    });

    it('does not flatten empty objects', () => {
      const tree = { key1: {} };
      expect(flattenObjectTreeToArrays(tree)).to.deep.equal([
        { path: ['key1'], value: {} },
      ]);
    });

    it('flattens branches that are arrays of objects', () => {
      const tree = { key1: [{ key3: 'some value' }] };
      expect(flattenObjectTreeToArrays(tree)).to.deep.equal([
        { path: ['key1', '0', 'key3'], value: 'some value' },
      ]);
    });

    it('flattens multiple array branches', () => {
      const tree = { key1: [{ key21: 1 }, { key22: 2 }] };
      expect(flattenObjectTreeToArrays(tree)).to.deep.equal([
        { path: ['key1', '0', 'key21'], value: 1 },
        { path: ['key1', '1', 'key22'], value: 2 },
      ]);
    });

    it('flattens multiple object branches', () => {
      const tree = { key1: { a: 'something', b: 'something else' } };
      expect(flattenObjectTreeToArrays(tree)).to.deep.equal([
        { path: ['key1', 'a'], value: 'something' },
        { path: ['key1', 'b'], value: 'something else' },
      ]);
    });

    it('flattens trees with boolean values', () => {
      const tree = { key1: [{ key2: false }], key3: true };
      expect(flattenObjectTreeToArrays(tree)).to.deep.equal([
        { path: ['key1', '0', 'key2'], value: false },
        { path: ['key3'], value: true },
      ]);
    });

    it('does not flatten empty arrays', () => {
      const tree = { key1: [] };
      expect(flattenObjectTreeToArrays(tree)).to.deep.equal([
        { path: ['key1'], value: [] },
      ]);
    });

    it('does not flatten arrays which contain data other than objects', () => {
      const tree = { key1: [{ key2: 1 }, 'some value'] };
      expect(flattenObjectTreeToArrays(tree)).to.deep.equal([
        { path: ['key1'], value: [{ key2: 1 }, 'some value'] },
      ]);
    });

    it(`flattens the object into arrays ordered
        by the root properties' order`, () => {
      const tree = { b: 'value1', a: { someKey: 'value2' } };
      expect(flattenObjectTreeToArrays(tree)).to.deep.equal([
        { path: ['b'], value: 'value1' },
        { path: ['a', 'someKey'], value: 'value2' },
      ]);
    });

    it('stores number keys as strings', () => {
      const tree = { key1: [{ key2: 1 }] };
      expect(flattenObjectTreeToArrays(tree)).to.deep.equal([
        { path: ['key1', '0', 'key2'], value: 1 },
      ]);
    });

    it('returns an empty array when object tree is empty', () => {
      expect(flattenObjectTreeToArrays({})).to.deep.equal([]);
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
