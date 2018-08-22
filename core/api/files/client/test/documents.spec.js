// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import {
  loanDocuments,
  propertyDocuments,
  borrowerDocuments,
} from '../../documents';

describe('documents', () => {
  it('all document ids are defined', () => {
    loanDocuments({ general: {} })
      .all()
      .forEach(({ id }) => {
        expect(id).to.not.equal(undefined);
        expect(typeof id).to.equal('string');
      });

    propertyDocuments({})
      .all()
      .forEach(({ id }) => {
        expect(id).to.not.equal(undefined);
        expect(typeof id).to.equal('string');
      });

    borrowerDocuments({})
      .all()
      .forEach(({ id }) => {
        expect(id).to.not.equal(undefined);
        expect(typeof id).to.equal('string');
      });
  });
});
