/* eslint-env mocha */
import { expect } from 'chai';

import { arrayify, flattenObjectTreeToArrays } from '../general';

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
});
