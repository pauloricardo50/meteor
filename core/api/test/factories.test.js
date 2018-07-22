/* eslint-env mocha */
import { expect } from 'chai';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';

const factories = [
  'user',
  'dev',
  'admin',
  'borrower',
  'loan',
  'offer',
  'property',
];

describe('Factories', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('with stubbed collections', () => {
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
