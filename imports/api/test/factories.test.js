/* eslint-env mocha */
import { expect } from 'chai';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { stubCollections } from '/imports/js/helpers/testHelpers';

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
    'partner',
    'borrower',
    'loanRequest',
    'offer',
    'comparator',
    'property',
    'adminAction',
  ];

  factories.forEach((fact) => {
    it(`${fact} builds correctly`, () => {
      const result = Factory.create(fact, {
        userId: 'testId',
        requestId: 'test-request',
      });

      expect(typeof result).to.equal('object');
      expect(result._id).to.not.equal(undefined);
    });
  });
});
