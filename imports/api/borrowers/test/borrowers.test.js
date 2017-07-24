/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import Borrowers from '../borrowers';
import {
  insertBorrower,
  updateBorrower,
  pushBorrowerValue,
  popBorrowerValue,
} from '../methods';
import { stubCollections } from '/imports/js/helpers/testHelpers';

import '../../factories.js';

describe('borrowers', function () {
  this.timeout(10000);
  before(() => {
    stubCollections();
  });

  beforeEach(function () {
    // if (Meteor.isServer) {
    resetDatabase();
    // }
  });

  describe('mutators', function () {
    it('builds correctly from factory', function () {
      const borrower = Factory.create('borrower');
      expect(typeof borrower).to.equal('object');
      expect(borrower._id).to.exist;
    });
  });

  describe('methods', () => {
    describe('insertBorrower', () => {
      it('Properly inserts a minimal borrower', () => {
        const object = {};
        const userId = 'asdf';

        const borrowerId = insertBorrower.call({ object, userId });
        const borrower = Borrowers.findOne({ _id: borrowerId });

        expect(typeof borrower).to.equal('object');
        expect(borrower.userId).to.equal(userId);
      });
    });

    describe('modifiers', () => {
      let borrower;

      beforeEach(() => {
        borrower = Factory.create('borrower');
      });

      describe('updateBorrower', () => {
        it('Updates a borrower', () => {
          const id = borrower._id;
          const object = { firstName: 'John' };
          updateBorrower.call({ object, id });
          const modifiedBorrower = Borrowers.findOne({ _id: id });

          expect(modifiedBorrower.firstName).to.equal('John');
        });
      });

      describe('pushBorrowerValue', () => {
        it('Pushes a value to borrower', () => {
          const id = borrower._id;
          const object = { expenses: { description: 'test2', value: 2 } };
          pushBorrowerValue.call({ object, id });
          const modifiedBorrower = Borrowers.findOne({ _id: id });
          const length = borrower.expenses.length;

          expect(modifiedBorrower.expenses.length).to.equal(length + 1);
        });
      });

      describe('popBorrowerValue', () => {
        it('Pops a value from a borrower', () => {
          const id = borrower._id;
          const object = { expenses: 1 };
          popBorrowerValue.call({ object, id });
          const modifiedBorrower = Borrowers.findOne({ _id: id });
          const length = borrower.expenses.length;

          expect(modifiedBorrower.expenses.length).to.equal(length - 1);
        });
      });
    });
  });
});
