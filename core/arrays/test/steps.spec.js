/* eslint-env mocha */
import { expect } from 'chai';
import { _ } from 'lodash';

import {
  previousDone,
  getPercent,
  shouldCountField,
  getCountedArray,
  filesPercent,
  closingPercent,
} from '../steps';

describe('steps', () => {
  describe('previousDone', () => {
    const dummySteps = [
      {
        items: [
          { isDone: () => true },
          { isDone: () => true },
          { isDone: () => false },
          { isDone: () => true },
        ],
      },
    ];
    it('works', () => {
      expect(previousDone(dummySteps, 0, 0)).to.equal(true);
      expect(previousDone(dummySteps, 0, 1)).to.equal(true);
      expect(previousDone(dummySteps, 0, 2)).to.equal(true);
      expect(previousDone(dummySteps, 0, 3)).to.equal(false);
    });

    it('throws an error if a stepNb exceeds step length', () => {
      expect(() => previousDone(dummySteps, 1, 4)).to.throw('invalid stepNb');
    });

    it('throws an error if itemNb exceeds items length', () => {
      expect(() => previousDone(dummySteps, 0, 5)).to.throw('invalid itemNb');
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

  describe('filesPercent', () => {
    let dummyFunc;
    let dummyDoc;

    beforeEach(() => {
      dummyFunc = () => [[{ id: 'myFile' }]];
      dummyDoc = { documents: {} };
    });

    it('returns 0 if an empty doc is given', () => {
      expect(filesPercent({ doc: dummyDoc, fileArrayFunc: dummyFunc, step: 0 })).to.equal(0);
    });

    it('returns 1 if a file exists', () => {
      // file exists
      dummyDoc.documents.myFile = { files: [{}] };
      expect(filesPercent({ doc: dummyDoc, fileArrayFunc: dummyFunc, step: 0 })).to.equal(1);
    });

    it("doesn't count files which aren't required", () => {
      dummyFunc = () => [[{ id: 'myFile', required: false }]];
      dummyDoc.documents.myFile = { files: [] };
      expect(filesPercent({ doc: dummyDoc, fileArrayFunc: dummyFunc, step: 0 })).to.equal(0);
    });

    it("doesn't count files whose condition is explicitly false", () => {
      dummyFunc = () => [[{ id: 'myFile', condition: false }]];
      dummyDoc.documents.myFile = { files: [] };
      expect(filesPercent({ doc: dummyDoc, fileArrayFunc: dummyFunc, step: 0 })).to.equal(0);
    });

    it('counts files whose condition is undefined', () => {
      dummyFunc = () => [[{ id: 'myFile', condition: undefined }]];
      dummyDoc.documents.myFile = { files: [{}] };
      expect(filesPercent({ doc: dummyDoc, fileArrayFunc: dummyFunc, step: 0 })).to.equal(1);
    });

    describe('array of docs', () => {
      it('sums percentages if given an array of docs', () => {
        // deep copy of initial doc
        const initialDoc = JSON.parse(JSON.stringify(dummyDoc));
        dummyDoc.documents.myFile = { files: [{}] };

        expect(filesPercent({
          doc: [initialDoc, dummyDoc],
          fileArrayFunc: dummyFunc,
          step: 0,
        })).to.equal(0.5);
      });
    });

    describe('status verification', () => {
      it('returns 0 if no files are valid', () => {
        dummyFunc = () => [[{ id: 'myFile', condition: undefined }]];
        dummyDoc.documents.myFile = { files: [{ status: 'INVALID' }] };
        expect(filesPercent({
          doc: dummyDoc,
          fileArrayFunc: dummyFunc,
          step: 0,
          checkValidity: true,
        })).to.equal(0);
      });

      it('returns 0.5 if one file is valid', () => {
        dummyFunc = () => [
          [
            { id: 'myFile', condition: undefined },
            { id: 'myFile2', condition: undefined },
          ],
        ];
        dummyDoc.documents.myFile = { files: [{ status: 'INVALID' }] };
        dummyDoc.documents.myFile2 = { files: [{ status: 'VALID' }] };
        expect(filesPercent({
          doc: dummyDoc,
          fileArrayFunc: dummyFunc,
          step: 0,
          checkValidity: true,
        })).to.equal(0.5);
      });
    });
  });

  describe('closingPercent', () => {
    it('returns 0 for no steps', () => {
      const r = { logic: { closingSteps: [] } };
      expect(closingPercent(r)).to.equal(0);
    });

    it('returns 1 for one valid todo step', () => {
      const r = {
        logic: { closingSteps: [{ status: 'VALID', type: 'TODO' }] },
      };
      expect(closingPercent(r)).to.equal(1);
    });

    it('returns 0.5 for one valid and invalid todo step', () => {
      const r = {
        logic: {
          closingSteps: [
            { status: 'VALID', type: 'TODO' },
            { status: 'UNVERIFIED', type: 'TODO' },
          ],
        },
      };
      expect(closingPercent(r)).to.equal(0.5);
    });

    it('returns 0 for one unverified upload', () => {
      const r = {
        logic: { closingSteps: [{ type: 'UPLOAD', id: 'myFile' }] },
        files: { myFile: [{ status: 'UNVERIFIED' }] },
      };
      expect(closingPercent(r)).to.equal(0);
    });

    it('returns 1 for one valid upload', () => {
      const r = {
        logic: { closingSteps: [{ type: 'UPLOAD', id: 'myFile' }] },
        files: { myFile: [{ status: 'VALID' }] },
      };
      expect(closingPercent(r)).to.equal(1);
    });

    it('returns 0.5 for one valid and invalid upload', () => {
      const r = {
        logic: {
          closingSteps: [
            { type: 'UPLOAD', id: 'myFile' },
            { type: 'UPLOAD', id: 'myFile2' },
          ],
        },
        files: {
          myFile: [{ status: 'VALID' }],
          myFile2: [{ status: 'UNVERIFIED' }],
        },
      };
      expect(closingPercent(r)).to.equal(0.5);
    });
  });
});
