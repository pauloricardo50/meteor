/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';

import generator from '../../../factories/server';
import { BORROWERS_COLLECTION } from '../../../borrowers/borrowerConstants';
import { asyncForEach } from '../../../helpers';
import { FILE_STATUS, BORROWER_DOCUMENTS } from '../../fileConstants';
import FileService from '../FileService';
import S3Service from '../S3Service';
import { clearBucket } from './S3Service.test';

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

describe('FileService', function() {
  this.timeout(30000);

  before(function() {
    if (Meteor.settings.public.microservice !== 'pro') {
      // When running these tests in parallel, it breaks tests
      this.parent.pending = true;
      this.skip();
    }
  });

  beforeEach(() => clearBucket().then(setupBucket));

  describe('getFilesForDoc', () => {
    it('lists all files uploaded to a doc', () => {
      const expected = [{ Key: key1 }, { Key: key2 }, { Key: key3 }];
      return FileService.listFilesForDoc(docId).then(results => {
        expect(results.length).to.equal(expected.length);
        results.forEach((result, index) =>
          expect(result).to.deep.include(expected[index]),
        );
      });
    });

    it('lists all files uploaded to a doc at a subdocument', () => {
      const expected = [{ Key: key1 }, { Key: key2 }];
      const subdocument = 'a';
      return FileService.listFilesForDoc(docId, subdocument).then(results => {
        expect(results.length).to.equal(expected.length);
        results.forEach((result, index) =>
          expect(result).to.deep.include(expected[index]),
        );
      });
    });
  });

  describe('setFileStatus', () => {
    it('changes the status of a file', () => {
      const nextStatus = 'VALID';
      return FileService.setFileStatus(key1, nextStatus)
        .then(() => S3Service.getObject(key1))
        .then(({ Metadata: { status } }) =>
          expect(status).to.equal(nextStatus),
        );
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
        .then(results => {
          expect(results.length).to.equal(expected.length);
          results.forEach((result, index) =>
            expect(result).to.deep.include(expected[index]),
          );
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

  describe('flushTempFiles', () => {
    it('deletes 15 minutes old temp files', async () => {
      const clock = sinon.useFakeTimers(Date.now());
      clock.tick(16 * 60 * 1000);

      const tempFiles = [...Array(5)].map((_, i) => ({
        file: Buffer.from(`hello${i}`, 'utf-8'),
        key: FileService.getTempS3FileKey(
          'test',
          {
            name: `file${i}.pdf`,
          },
          { id: `file${i}` },
        ),
      }));

      await Promise.all(
        tempFiles.map(({ file, key }) => S3Service.putObject(file, key)),
      );

      const deletedFiles = await FileService.flushTempFiles();

      clock.restore();
      return expect(deletedFiles).to.equal(5);
    });
  });

  describe('autoRenameFile', () => {
    const generateAndRenameFiles = async (count, date = '') => {
      await asyncForEach([...Array(count)], async (_, i) => {
        const fileKey = FileService.getS3FileKey(
          {
            name: `${date ? `${date} ` : ''}file${i}.pdf`,
          },
          { docId: 'borrower', id: BORROWER_DOCUMENTS.IDENTITY },
        );

        await S3Service.putObject(Buffer.from(`hello${i}`, 'utf-8'), fileKey);

        await FileService.autoRenameFile(fileKey, BORROWERS_COLLECTION);
      });
    };

    it('renames a single file', async () => {
      generator({
        borrowers: {
          _id: 'borrower',
        },
      });

      const today = moment().format('YYYY-MM-DD');

      await generateAndRenameFiles(1);

      const files = await FileService.listFilesForDoc('borrower');

      expect(files.length).to.equal(1);
      expect(files[0]).to.deep.include({
        Key: `borrower/${BORROWER_DOCUMENTS.IDENTITY}/${today} Pièce d'identité valable.pdf`,
      });
    });

    it('renames multiple files', async () => {
      generator({
        borrowers: {
          _id: 'borrower',
        },
      });

      const today = moment().format('YYYY-MM-DD');

      await generateAndRenameFiles(2);

      const files = await FileService.listFilesForDoc('borrower');

      expect(files.length).to.equal(2);
      expect(files[0]).to.deep.include({
        Key: `borrower/${BORROWER_DOCUMENTS.IDENTITY}/${today} Pièce d'identité valable (1 sur 2).pdf`,
      });
      expect(files[1]).to.deep.include({
        Key: `borrower/${BORROWER_DOCUMENTS.IDENTITY}/${today} Pièce d'identité valable (2 sur 2).pdf`,
      });
    });

    it('does not override date if it already exists', async () => {
      generator({
        borrowers: {
          _id: 'borrower',
        },
      });

      const today = moment().format('YYYY-MM-DD');
      const yesterday = moment()
        .subtract(1, 'days')
        .format('YYYY-MM-DD');

      await generateAndRenameFiles(1, yesterday);

      await generateAndRenameFiles(1);

      const files = await FileService.listFilesForDoc('borrower');

      expect(files.length).to.equal(2);
      expect(files[0]).to.deep.include({
        Key: `borrower/${BORROWER_DOCUMENTS.IDENTITY}/${yesterday} Pièce d'identité valable (1 sur 2).pdf`,
      });
      expect(files[1]).to.deep.include({
        Key: `borrower/${BORROWER_DOCUMENTS.IDENTITY}/${today} Pièce d'identité valable (2 sur 2).pdf`,
      });
    });
  });
});
