/* eslint-env mocha */
import { expect } from 'chai';

import { filesPercent } from '../fileHelpers';

describe('fileHelpers', () => {
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
});
