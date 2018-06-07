/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { Factory } from 'meteor/dburles:factory';
import { stubCollections } from 'core/utils/testHelpers';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import sinon, { spy } from 'sinon';

import BorrowerService from '../../BorrowerService';
import Borrowers from '../../borrowers';

describe('BorrowerService', () => {
  let borrower;
  let user;
  const firstName = 'testFirstName';
  const lastName = 'testLastName';

  beforeEach(() => {
    resetDatabase();
    stubCollections();
  });

  afterEach(() => {
    stubCollections.restore();
  });

  describe('insertWithUserNames', () => {
    beforeEach(() => {
      resetDatabase();
      stubCollections();

      user = Factory.create('user', { firstName, lastName });
      borrower = {
        expenses: [{ description: 'test', value: 1 }],
        documents: {},
        logic: {},
        age: 18,
        userId: user._id,
      };
    });

    afterEach(() => {
      stubCollections.restore();
    });

    it("sets the borrowers first and last name when the user's first and last name are defined", () => {
      const newBorrowerId = BorrowerService.insertWithUserNames({
        borrower,
        userId: user._id,
      });

      return expect(Borrowers.findOne(newBorrowerId)).to.deep.include({
        firstName,
        lastName,
      });
    });

    it("doesn't modify the borrower when the user' firstName and lastName are not defined", () => {
      Meteor.users.update(
        { _id: user._id },
        { $unset: { firstName: '', lastName: '' } },
      );

      const newBorrowerId = BorrowerService.insertWithUserNames({
        borrower,
        userId: user._id,
      });

      borrower._id = newBorrowerId;

      return expect(Borrowers.findOne(newBorrowerId))
        .to.deep.equal(borrower)
        .and.not.to.include({ firstName, lastName });
    });

    it("only adds on the borrower the user's names that are defined", () => {
      // if user's lastName is defined, but firstName not,
      // it will only add lastName to the borrower
      Meteor.users.update({ _id: user._id }, { $unset: { firstName: '' } });

      const newBorrowerId = BorrowerService.insertWithUserNames({
        borrower,
        userId: user._id,
      });

      const newBorrower = Borrowers.findOne(newBorrowerId);

      expect(newBorrower)
        .to.have.property('lastName')
        .and.not.to.have.property('firstName');

      expect(newBorrower.lastName).to.deep.equal(lastName);
    });
  });

  describe('smartInsert', () => {
    beforeEach(() => {
      resetDatabase();
      stubCollections();

      user = Factory.create('user', { firstName, lastName });
      Factory.create('borrower', { userId: user._id });

      sinon.stub(BorrowerService, 'insert');
      sinon.stub(BorrowerService, 'insertWithUserNames');
    });

    afterEach(() => {
      stubCollections.restore();
      BorrowerService.insert.restore();
      BorrowerService.insertWithUserNames.restore();
    });

    it('calls BorrowerService.insertWithUserNames when there is no borrower for the provided userId', () => {
      Borrowers.remove({});

      expect(BorrowerService.insertWithUserNames.called).to.equal(false);

      BorrowerService.smartInsert({ borrower, userId: user._id });

      expect(BorrowerService.insertWithUserNames.called).to.equal(true);
    });

    it('calls BorrowerService.insert when there is at least one borrower for the provided userId', () => {
      expect(BorrowerService.insert.called).to.equal(false);
      expect(BorrowerService.insertWithUserNames.called).to.equal(false);

      BorrowerService.smartInsert({ borrower, userId: user._id });

      expect(BorrowerService.insertWithUserNames.called).to.equal(false);
      expect(BorrowerService.insert.callCount).to.equal(1);
    });
  });
});
