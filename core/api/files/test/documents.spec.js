/* eslint-env mocha */
import { expect } from 'chai';

import { getDocumentIDs } from '../documents';

describe('documents', () => {
  describe('getDocumentIDs', () => {
    it('throws if a wrong list is passed', () => {
      expect(() => getDocumentIDs('random-list')).to.throw();
    });

    it('returns an array of strings for the borrower list', () => {
      const ids = getDocumentIDs('borrowers');
      expect(typeof ids).to.equal('object');
      ids.forEach(id => expect(typeof id).to.equal('string'));
    });

    it('returns an array of strings for the loan list', () => {
      const ids = getDocumentIDs('loans');
      expect(typeof ids).to.equal('object');
      ids.forEach(id => expect(typeof id).to.equal('string'));
    });
  });
});
