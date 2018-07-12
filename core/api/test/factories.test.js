/* eslint-env mocha */
import { expect } from 'chai';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { stubCollections } from 'core/utils/testHelpers';

const factories = [
  'user',
  'dev',
  'admin',
  'borrower',
  'loan',
  'offer',
  'property',
];

describe.only('Factories', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('with stubbed collections', () => {
    beforeEach(() => {
      stubCollections();
    });

    afterEach(() => {
      stubCollections.restore();
    });

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

  describe('without stubbed collections', () => {
    beforeEach(() => {
      stubCollections.restore();
    });

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
});
