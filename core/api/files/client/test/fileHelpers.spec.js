/* eslint-env mocha */
import { expect } from 'chai';

import { filesPercent, getMissingDocumentIds } from '../../fileHelpers';

describe('fileHelpers', () => {
  let dummyFunc;
  let dummyDoc;
  let fileId;

  beforeEach(() => {
    fileId = 'myFile';
    dummyFunc = () => [[{ id: fileId }]];
    dummyDoc = { documents: {} };
  });

  describe('filesPercent', () => {
    it('returns 0 if an empty doc is given', () => {
      expect(filesPercent({ doc: {}, fileArrayFunc: dummyFunc, step: 0 })).to.equal(0);
    });

    it('returns 0 if no doc is given', () => {
      expect(filesPercent({ fileArrayFunc: dummyFunc, step: 0 })).to.equal(0);
    });

    it('returns 1 if a file exists', () => {
      // file exists
      dummyDoc.documents.myFile = [{}];
      expect(filesPercent({ doc: dummyDoc, fileArrayFunc: dummyFunc, step: 0 })).to.equal(1);
    });

    it('returns 0 if an empty array is given', () => {
      dummyDoc.documents.myFile = [];
      expect(filesPercent({ doc: dummyDoc, fileArrayFunc: dummyFunc, step: 0 })).to.equal(0);
    });

    it("doesn't count files which aren't required", () => {
      dummyFunc = () => [[{ id: 'myFile', required: false }]];
      dummyDoc.documents.myFile = [];
      expect(filesPercent({ doc: dummyDoc, fileArrayFunc: dummyFunc, step: 0 })).to.equal(1);
    });

    it("doesn't count files whose condition is explicitly false", () => {
      dummyFunc = () => [[{ id: 'myFile', condition: false }]];
      dummyDoc.documents.myFile = [];
      expect(filesPercent({ doc: dummyDoc, fileArrayFunc: dummyFunc, step: 0 })).to.equal(1);
    });

    it('counts files whose condition is undefined', () => {
      dummyFunc = () => [[{ id: 'myFile', condition: undefined }]];
      dummyDoc.documents.myFile = [{}];
      expect(filesPercent({ doc: dummyDoc, fileArrayFunc: dummyFunc, step: 0 })).to.equal(1);
    });

    describe('array of docs', () => {
      it('sums percentages if given an array of docs', () => {
        // deep copy of initial doc
        const initialDoc = JSON.parse(JSON.stringify(dummyDoc));
        dummyDoc.documents.myFile = [{}];

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
        dummyDoc.documents.myFile = [{ status: 'INVALID' }];
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
        dummyDoc.documents.myFile = [{ status: 'INVALID' }];
        dummyDoc.documents.myFile2 = [{ status: 'VALID' }];
        expect(filesPercent({
          doc: dummyDoc,
          fileArrayFunc: dummyFunc,
          step: 0,
          checkValidity: true,
        })).to.equal(0.5);
      });
    });
  });

  describe('getMissingDocumentIds', () => {
    it('returns the array of missing docs', () => {
      expect(getMissingDocumentIds({
        doc: dummyDoc,
        fileArrayFunc: dummyFunc,
        step: 0,
      })).to.deep.equal([fileId]);
    });

    it('returns an empty array if all documents have been uploaded', () => {
      dummyDoc.documents[fileId] = [{}];
      expect(getMissingDocumentIds({
        doc: dummyDoc,
        fileArrayFunc: dummyFunc,
        step: 0,
      })).to.deep.equal([]);
    });
  });
});
