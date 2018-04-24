/* eslint-env mocha */
import { expect } from 'chai';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { stubCollections } from 'core/utils/testHelpers';

describe('Factories', () => {
  beforeEach(() => {
    resetDatabase();
    stubCollections();
  });

  afterEach(() => {
    stubCollections.restore();
  });

  const factories = [
    'user',
    'dev',
    'admin',
    'lender',
    'borrower',
    'loan',
    'offer',
    'property',
  ];

  factories.forEach((fact) => {
    it(`${fact} builds correctly`, () => {
      const result = Factory.create(fact, {
        userId: 'testId',
        loanId: 'test-loan',
      });

      expect(typeof result).to.equal('object');
      expect(result._id).to.not.equal(undefined);
    });
  });
});
