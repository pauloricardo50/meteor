/* eslint-env mocha */
import { expect } from 'chai';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import FileService from '../FileService';

describe('FileService', () => {
  describe('addFileToDoc', () => {
    let docId;

    beforeEach(() => {
      resetDatabase();
      docId = Factory.create('loan')._id;
    });

    it('works if the doc does not exist before', () => {
      expect(() =>
        FileService.addFileToDoc({
          collection: 'loans',
          docId,
          documentId: 'buyersContract',
          file: {
            initialName: '',
            size: 10,
            type: 'application/pdf',
            url: 'http://www.some-url.com',
            key: 'some-key',
          },
        })).to.not.throw();
    });
  });
});
