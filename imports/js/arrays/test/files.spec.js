/* eslint-env mocha */
import { expect } from 'chai';

import { getFileIDs, getFileSchema, FileSchema } from '../files';

describe('files', () => {
  describe('getFileIDs', () => {
    it('throws if a wrong list is passed', () => {
      expect(() => getFileIDs('random-list')).to.throw();
    });

    it('returns an array of strings for the borrower list', () => {
      const ids = getFileIDs('borrower');
      expect(typeof ids).to.equal('object');
      ids.forEach(id => expect(typeof id).to.equal('string'));
    });

    it('returns an array of strings for the request list', () => {
      const ids = getFileIDs('request');
      expect(typeof ids).to.equal('object');
      ids.forEach(id => expect(typeof id).to.equal('string'));
    });
  });

  describe('getFileSchema', () => {
    it('throws for the wrong list', () => {
      expect(() => getFileSchema('wrong-list')).to.throw();
    });

    it('returns an object of correct objects for borrower and request lists', () => {
      ['borrower', 'request'].forEach((list) => {
        const idCount = getFileIDs(list).length;
        const schema = getFileSchema(list);

        expect(typeof schema).to.equal('object');
        expect(Object.keys(schema)).to.have.length(2 * idCount);
        Object.keys(schema).forEach((fileKey) => {
          const file = schema[fileKey];
          if (fileKey.indexOf('$') > 0) {
            expect(file).to.equal(FileSchema);
          } else {
            expect(typeof file).to.equal('object');
            expect(file.type).to.equal(Array);
            expect(file.optional).to.equal(true);
            expect(file.maxCount).to.equal(100);
          }
        });
      });
    });
  });
});
