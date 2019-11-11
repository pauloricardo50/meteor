/* eslint-env mocha */
import { expect } from 'chai';

import { filesPercent, getMissingDocumentIds } from '../../fileHelpers';

describe('fileHelpers', () => {
  let fileArray;
  let dummyDoc;
  let fileId;

  beforeEach(() => {
    fileId = 'myFile';
    fileArray = [{ id: fileId }];
    dummyDoc = { documents: {} };
  });

  describe('filesPercent', () => {
    it('returns 0 if an empty doc is given', () => {
      expect(filesPercent({ doc: {}, fileArray })).to.deep.equal({
        percent: 0,
        count: 1,
      });
    });

    it('returns 0 if no doc is given', () => {
      expect(filesPercent({ fileArray })).to.deep.equal({
        percent: 0,
        count: 1,
      });
    });

    it('returns 1 if a file exists', () => {
      // file exists
      dummyDoc.documents.myFile = [{}];
      expect(filesPercent({ doc: dummyDoc, fileArray })).to.deep.equal({
        percent: 1,
        count: 1,
      });
    });

    it('returns 0 if an empty array is given', () => {
      dummyDoc.documents.myFile = [];
      expect(filesPercent({ doc: dummyDoc, fileArray })).to.deep.equal({
        percent: 0,
        count: 1,
      });
    });

    it("doesn't count files which aren't required", () => {
      fileArray = [{ id: 'myFile', required: false }];
      dummyDoc.documents.myFile = [];
      expect(filesPercent({ doc: dummyDoc, fileArray })).to.deep.equal({
        percent: 1,
        count: 0,
      });
    });

    describe('status verification', () => {
      it('returns 0 if no files are valid', () => {
        fileArray = [{ id: 'myFile', condition: undefined }];
        dummyDoc.documents.myFile = [{ status: 'INVALID' }];
        expect(
          filesPercent({
            doc: dummyDoc,
            fileArray,
            checkValidity: true,
          }),
        ).to.deep.equal({
          percent: 0,
          count: 1,
        });
      });

      it('returns 0.5 if one file is valid', () => {
        fileArray = [
          { id: 'myFile', condition: undefined },
          { id: 'myFile2', condition: undefined },
        ];

        dummyDoc.documents.myFile = [{ status: 'INVALID' }];
        dummyDoc.documents.myFile2 = [{ status: 'VALID' }];
        expect(
          filesPercent({
            doc: dummyDoc,
            fileArray,
            checkValidity: true,
          }),
        ).to.deep.equal({
          percent: 0.5,
          count: 2,
        });
      });
    });
  });

  describe('getMissingDocumentIds', () => {
    it('returns the array of missing docs', () => {
      expect(
        getMissingDocumentIds({
          doc: dummyDoc,
          fileArray,
        }),
      ).to.deep.equal([fileId]);
    });

    it('returns an empty array if all documents have been uploaded', () => {
      dummyDoc.documents[fileId] = [{}];
      expect(
        getMissingDocumentIds({
          doc: dummyDoc,
          fileArray,
        }),
      ).to.deep.equal([]);
    });
  });
});
