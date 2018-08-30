/* eslint-env mocha */
import { expect } from 'chai';

import FileService from '../FileService';
import S3Service from '../S3Service';
import { clearBucket } from './S3Service.test';
import { FILE_STATUS } from '../../fileConstants';

const docId = 'someDocId';
const json = { hello: 'world' };
const binaryData = Buffer.from(JSON.stringify(json), 'utf-8');
const fileName = 'hello.json';

const key1 = `${docId}/a/first-${fileName}`;
const key2 = `${docId}/a/second-${fileName}`;
const key3 = `${docId}/b/third-${fileName}`;

const setupBucket = () =>
  S3Service.putObject(binaryData, key1)
    .then(() => S3Service.putObject(binaryData, key2))
    .then(() => S3Service.putObject(binaryData, key3));

describe('FileService', () => {
  beforeEach(() => clearBucket().then(setupBucket));

  describe('getFilesForDoc', () => {
    it('lists all files uploaded to a doc', () => {
      const expected = [{ Key: key1 }, { Key: key2 }, { Key: key3 }];
      return FileService.listFilesForDoc(docId).then((results) => {
        expect(results.length).to.equal(expected.length);
        results.forEach((result, index) =>
          expect(result).to.deep.include(expected[index]));
      });
    });

    it('lists all files uploaded to a doc at a subdocument', () => {
      const expected = [{ Key: key1 }, { Key: key2 }];
      const subdocument = 'a';
      return FileService.listFilesForDoc(docId, subdocument).then((results) => {
        expect(results.length).to.equal(expected.length);
        results.forEach((result, index) =>
          expect(result).to.deep.include(expected[index]));
      });
    });
  });

  describe('setFileStatus', () => {
    it('changes the status of a file', () => {
      const nextStatus = 'VALID';
      return FileService.setFileStatus(key1, nextStatus)
        .then(() => S3Service.getObject(key1))
        .then(({ Metadata: { status } }) =>
          expect(status).to.equal(nextStatus));
    });
  });

  describe('setFileError', () => {
    it('Sets an error and status on a file', () => {
      const error = 'Not good my bro.';
      return FileService.setFileError(key1, error)
        .then(() => S3Service.getObject(key1))
        .then(({ Metadata: { message, status } }) => {
          expect(status).to.equal(FILE_STATUS.ERROR);
          expect(message).to.equal(error);
        });
    });
  });

  describe('setFileValid', () => {
    it('Removes error from file and sets status to valid ', () => {
      const newError = 'not good';
      return FileService.setFileError(key1, newError)
        .then(() => FileService.setFileValid(key1))
        .then(() => S3Service.getObject(key1))
        .then(({ Metadata: { message, status } }) => {
          expect(status).to.equal(FILE_STATUS.VALID);
          expect(message).to.equal('');
        });
    });
  });

  describe('deleteAllFilesForDoc', () => {
    it('deletes all files at a subdocument', () => {
      const subdocument = 'a';
      const expected = [{ Key: key3 }];
      return FileService.deleteAllFilesForDoc(docId, subdocument)
        .then(() => FileService.listFilesForDoc(docId))
        .then((results) => {
          expect(results.length).to.equal(expected.length);
          results.forEach((result, index) =>
            expect(result).to.deep.include(expected[index]));
        });
    });

    it('deletes all files for a mongoDB document', () =>
      FileService.deleteAllFilesForDoc(docId)
        .then(() => FileService.listFilesForDoc(docId))
        .then(results => expect(results.length).to.equal(0)));
  });

  describe('groupFilesByCategory', () => {
    it('groups 2 files in the same category', () => {
      const files = [
        { Key: 'asdf/category1/whatever.pdf' },
        { Key: 'asdf/category1/dude.pdf' },
      ];
      expect(FileService.groupFilesByCategory(files)).to.deep.equal({
        category1: files,
      });
    });

    it('groups multiple files in multiple categories', () => {
      const files = [
        { Key: 'asdf/category1/whatever.pdf' },
        { Key: 'asdf/category2/dude.pdf' },
      ];
      expect(FileService.groupFilesByCategory(files)).to.deep.equal({
        category1: [files[0]],
        category2: [files[1]],
      });
    });
  });
}).timeout(10000);
