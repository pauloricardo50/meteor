/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import { Accounts } from 'meteor/accounts-base';
import { stubCollections } from '/imports/js/helpers/testHelpers';

import Offers from '../offers';

import {
  insertOffer,
  insertAdminOffer,
  updateOffer,
  insertFakeOffer,
  deleteOffer,
} from '../methods';

import '../../factories.js';

describe('offers', () => {
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
      // FIXME This sometimes returns "Can't read property "_id" of undefined"
      // const offer = Factory.create('offer');
      //
      // expect(typeof offer).to.equal('object');
      // expect(offer._id).to.exist;
    });
  });

  describe('methods', () => {
    it('should work');
    // describe('insertOffer', () => {
    //   it('inserts an offer', () => {
    //     const user = Factory.create('partner');
    //     const object = Factory.build('offer');
    //
    //     Meteor.userId = () => user.userId;
    //
    //     const offerId = insertOffer.call({ object });
    //     const offer = Offers.findOne({ _id: offerId });
    //
    //     expect(typeof offer).to.equal('object');
    //     expect(offer.userId).to.equal(object.userId);
    //
    //     // Reset the userId function to its default value
    //     Meteor.userId = () => Accounts.userId;
    //   });
    // });
    // describe('modifiers', () => {
    //   let borrower;
    //   beforeEach(() => {
    //     borrower = Factory.create('borrower');
    //   });
    //
    //   describe('updateBorrower', () => {
    //     it('Updates a borrower', () => {
    //       const id = borrower._id;
    //       const object = { firstName: 'John' };
    //       updateBorrower.call({ object, id });
    //       const modifiedBorrower = Borrowers.findOne({ _id: id });
    //
    //       expect(modifiedBorrower.firstName).to.equal('John');
    //     });
    //   });
    //
    //   describe('pushBorrowerValue', () => {
    //     it('Pushes a value to borrower', () => {
    //       const id = borrower._id;
    //       const object = { expenses: { description: 'test2', value: 2 } };
    //       pushBorrowerValue.call({ object, id });
    //       const modifiedBorrower = Borrowers.findOne({ _id: id });
    //       const length = borrower.expenses.length;
    //
    //       expect(modifiedBorrower.expenses.length).to.equal(length + 1);
    //     });
    //   });
    //
    //   describe('popBorrowerValue', () => {
    //     it('Pops a value from a borrower', () => {
    //       const id = borrower._id;
    //       const object = { expenses: 1 };
    //       popBorrowerValue.call({ object, id });
    //       const modifiedBorrower = Borrowers.findOne({ _id: id });
    //       const length = borrower.expenses.length;
    //
    //       expect(modifiedBorrower.expenses.length).to.equal(length - 1);
    //     });
    //   });
    // });
  });
});
