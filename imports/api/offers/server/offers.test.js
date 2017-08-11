/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import { stubCollections } from '/imports/js/helpers/testHelpers';
import sinon from 'sinon';

import Offers from '../offers';

import {
  insertOffer,
  insertAdminOffer,
  updateOffer,
  insertFakeOffer,
  deleteOffer,
} from '../methods';

describe('offers', () => {
  let user;

  beforeEach(() => {
    // resetDatabase();
    stubCollections();
    user = Factory.create('partner');
    sinon.stub(Meteor, 'userId').callsFake(() => user._id);
    sinon.stub(Meteor, 'user').callsFake(() => user);
  });

  afterEach(() => {
    stubCollections.restore();
    Meteor.userId.restore();
    Meteor.user.restore();
  });

  describe('methods', () => {
    if (Meteor.isServer) {
      describe('insertOffer', () => {
        it('inserts an offer', (done) => {
          const object = Factory.build('offer');
          const request = Factory.create('loanRequest');
          object.requestId = request._id;
          object.userId = user._id;

          const offerId = insertOffer.call({ object }, (err, result) => {
            if (err) {
              done(err);
            }
            const offer = Offers.findOne({ _id: result });
            expect(typeof offer).to.equal('object');
            expect(offer.userId).to.equal(object.userId);
            done();
          });
        });
      });
    }

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
