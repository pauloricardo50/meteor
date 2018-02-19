/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import { stubCollections } from 'core/utils/testHelpers';
import sinon from 'sinon';

import Borrowers from '../../borrowers';

import {
  insertBorrower,
  updateBorrower,
  pushBorrowerValue,
  popBorrowerValue,
} from '../methods';

describe('Borrowers', () => {
  beforeEach(() => {
    resetDatabase();
    stubCollections();
  });

  afterEach(() => {
    stubCollections.restore();
  });

  describe('methods', () => {
    let borrowerId;
    let userId;

    beforeEach(() => {
      userId = Factory.create('user')._id;
      borrowerId = Factory.create('borrower', { userId })._id;
      sinon.stub(Meteor, 'userId').callsFake(() => userId);
    });

    afterEach(() => {
      Meteor.userId.restore();
    });

    describe('insertBorrower', () => {
      it('Properly inserts a minimal borrower', () => {
        const id = insertBorrower.call({ object: {}, userId });
        const borrower = Borrowers.findOne(id);

        expect(typeof borrower).to.equal('object');
        expect(borrower.userId).to.equal(userId);
      });
    });

    describe('updateBorrower', () => {
      it('Updates a borrower', () => {
        const object = { firstName: 'John' };
        updateBorrower.call({ object, id: borrowerId });
        const modifiedBorrower = Borrowers.findOne(borrowerId);

        expect(modifiedBorrower.firstName).to.equal('John');
      });
    });

    describe('pushBorrowerValue', () => {
      it('Pushes a value to borrower', () => {
        const object = { expenses: { description: 'test2', value: 2 } };
        const borrower = Borrowers.findOne(borrowerId);

        pushBorrowerValue.call({ object, id: borrowerId });
        const modifiedBorrower = Borrowers.findOne(borrowerId);
        const length = borrower.expenses.length;

        expect(modifiedBorrower.expenses.length).to.equal(length + 1);
      });
    });

    describe('popBorrowerValue', () => {
      it('Pops a value from a borrower', () => {
        const object = { expenses: 1 };
        const borrower = Borrowers.findOne(borrowerId);
        popBorrowerValue.call({ object, id: borrowerId });
        const modifiedBorrower = Borrowers.findOne(borrowerId);
        const length = borrower.expenses.length;

        expect(modifiedBorrower.expenses.length).to.equal(length - 1);
      });
    });
  });
});
