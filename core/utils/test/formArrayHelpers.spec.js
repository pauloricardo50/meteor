/* eslint-env mocha */
import { expect } from 'chai';

import {
  shouldCountField,
  getCountedArray,
  getMissingFieldIds,
  getFormValuesHash,
} from '../formArrayHelpers';

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
      expect(getCountedArray([], {})).to.deep.equal([]);
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

    it('should not count non required values', () => {
      expect(getCountedArray([{ id: 'id', required: false }], {
        id: 'yo',
      })).to.deep.equal([]);
    });

    it('should count non required values if specified', () => {
      expect(getCountedArray([{ id: 'id', required: false }], { id: 'yo' }, true)).to.deep.equal(['yo']);
    });

    describe('conditional values', () => {
      const trueValue = 'something';
      let array = [
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

      it('should not count the additionalValue if its not required', () => {
        array = [
          {
            type: 'conditionalInput',
            id: 'id1',
            conditionalTrueValue: trueValue,
            inputs: [{ id: 'conditional', required: false }, { id: 'test' }],
          },
        ];
        expect(getCountedArray(array, { conditional: trueValue })).to.deep.equal([undefined]);
      });
    });
  });

  describe('getMissingFieldIds', () => {
    let array;
    let doc;

    beforeEach(() => {
      array = [{ id: 'test' }];
      doc = {};
    });

    it('returns the list of missing fields', () => {
      expect(getMissingFieldIds(array, doc)).to.deep.equal(['test']);
    });

    it('returns an empty array if all fields are valid', () => {
      doc.test = 'stuff';
      expect(getMissingFieldIds(array, doc)).to.deep.equal([]);
    });

    it('works with nested data', () => {
      array = [{ id: 'test.value' }];
      doc.test = { value: 'stuff' };
      expect(getMissingFieldIds(array, doc)).to.deep.equal([]);
    });

    it('properly counts conditional undefined values', () => {
      const trueValue = 'something';
      array = [
        {
          type: 'conditionalInput',
          id: 'id1',
          conditionalTrueValue: trueValue,
          inputs: [{ id: 'conditional' }, { id: 'test' }],
        },
      ];
      expect(getMissingFieldIds(array, doc)).to.deep.equal(['conditional']);
    });

    it('properly counts conditional false values', () => {
      const trueValue = false;
      array = [
        {
          type: 'conditionalInput',
          id: 'id1',
          conditionalTrueValue: trueValue,
          inputs: [{ id: 'conditional' }, { id: 'test' }],
        },
      ];
      doc.conditional = true;
      expect(getMissingFieldIds(array, doc)).to.deep.equal([]);
    });

    it('properly counts conditional true values', () => {
      const trueValue = 'something';
      array = [
        {
          type: 'conditionalInput',
          id: 'id1',
          conditionalTrueValue: trueValue,
          inputs: [{ id: 'conditional' }, { id: 'test' }],
        },
      ];
      doc.conditional = trueValue;
      expect(getMissingFieldIds(array, doc)).to.deep.equal(['test']);
    });

    it('properly counts conditional true values and its children', () => {
      const trueValue = 'something';
      array = [
        {
          type: 'conditionalInput',
          id: 'id1',
          conditionalTrueValue: trueValue,
          inputs: [{ id: 'conditional' }, { id: 'test' }],
        },
      ];
      doc.conditional = trueValue;
      doc.test = 'stuff';
      expect(getMissingFieldIds(array, doc)).to.deep.equal([]);
    });

    it('does not count non required fields', () => {
      const trueValue = 'something';
      array = [
        {
          type: 'conditionalInput',
          id: 'id1',
          conditionalTrueValue: trueValue,
          inputs: [{ id: 'conditional' }, { id: 'test', required: false }],
        },
      ];
      expect(getMissingFieldIds(array, doc)).to.deep.equal(['conditional']);
    });

    it('deals with custom fields', () => {
      array = [{ id: 'test.value' }];
      doc.test = { value: 'stuff' };
      expect(getMissingFieldIds(array, doc)).to.deep.equal([]);
    });
  });

  describe('getFormValuesHash', () => {
    let array;
    let doc;

    beforeEach(() => {
      array = [{ id: 'test' }];
      doc = { test: { value: 'stuff' } };
    });

    it('returns a hash for the data', () => {
      array = [{ id: 'test.value' }];

      expect(getFormValuesHash(array, doc)).to.equal(272289896);
    });

    it('changes if the data changes', () => {
      array = [{ id: 'test.value' }];
      const doc2 = { test: { value: 'stuff2' } };

      expect(getFormValuesHash(array, doc)).to.not.equal(getFormValuesHash(array, doc2));
    });

    it('ignores irrelevant fields', () => {
      array = [{ id: 'test.value' }];
      const doc2 = { test: { value: 'stuff' }, a: 'b' };

      expect(getFormValuesHash(array, doc)).to.equal(getFormValuesHash(array, doc2));
    });

    it('counts non required values', () => {
      array = [{ id: 'test.value' }, { id: 'stuff', required: false }];
      const doc2 = { test: { value: 'stuff' }, stuff: 'r' };

      expect(getFormValuesHash(array, doc)).to.not.equal(getFormValuesHash(array, doc2));
    });
  });
});
