/* eslint-env mocha */
import { expect } from 'chai';

import { shouldCountField, getCountedArray } from '../formArrayHelpers';

describe('formArrayHelpers', () => {
  describe('shouldCountField', () => {
    it('counts fields whose condition is true or undefined', () => {
      expect(shouldCountField({ condition: true })).to.equal(true);
      expect(shouldCountField({ condition: undefined })).to.equal(true);
    });

    it('should return true for an empty object', () => {
      // Meaning, condition is undefined
      expect(shouldCountField({})).to.equal(true);
    });

    it('should return false if required is explicitly set to false', () => {
      expect(shouldCountField({ required: false })).to.equal(false);
      expect(shouldCountField({ required: undefined })).to.equal(true);
      expect(shouldCountField({ required: true })).to.equal(true);
    });

    it('should return false if disabled is set to true', () => {
      expect(shouldCountField({ disabled: true })).to.equal(false);
      expect(shouldCountField({ disabled: false })).to.equal(true);
      expect(shouldCountField({ disabled: undefined })).to.equal(true);
    });

    it('should return false for h3 types', () => {
      expect(shouldCountField({ type: 'h3' })).to.equal(false);
    });
  });

  describe('getCountedArray', () => {
    const dummyArray = [{ id: 'id1' }, { id: 'id2' }];
    it('returns an empty array if it is given an empty formArray', () => {
      expect(getCountedArray([], {}, [])).to.deep.equal([]);
    });

    it('should return an array with 2 undefined values for a simple array and an empty object', () => {
      expect(getCountedArray(dummyArray, {})).to.deep.equal([
        undefined,
        undefined,
      ]);
    });

    it('should return an array with the values of the document', () => {
      expect(getCountedArray(dummyArray, { id1: '1', id2: '2', idx: 'x' })).to.deep.equal(['1', '2']);
    });

    it('should work with nested id values', () => {
      expect(getCountedArray([...dummyArray, { id: 'id3.id' }], {
        id1: '1',
        id2: '2',
        id3: { id: '3' },
        idx: 'x',
      })).to.deep.equal(['1', '2', '3']);
    });

    it('pushes to the array passed in as 3rd param', () => {
      expect(getCountedArray(dummyArray, { id1: '1', id2: '2', idx: 'x' }, [
        'initialValue',
      ])).to.deep.equal(['initialValue', '1', '2']);
    });

    describe('conditional values', () => {
      const trueValue = 'something';
      const array = [
        {
          type: 'conditionalInput',
          id: 'id1',
          conditionalTrueValue: trueValue,
          inputs: [{ id: 'conditional' }, { id: 'test' }],
        },
      ];

      it('should only count the conditional value if it is false', () => {
        expect(getCountedArray(array, { conditional: 'anything' })).to.deep.equal(['anything']);
      });

      it('should count the conditional value and the following if it is true', () => {
        expect(getCountedArray(array, { conditional: trueValue })).to.deep.equal([trueValue, undefined]);
      });
    });
  });
});
