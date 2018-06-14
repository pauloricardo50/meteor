/* eslint-env mocha */
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { expect } from 'chai';
import sinon from 'sinon';
import { stubCollections } from 'core/utils/testHelpers';

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
      user = Factory.create('user', { firstName, lastName });
      borrower = { userId: user._id };
    });

    it("sets the borrowers first and last name with the user's first and last name", () => {
      const newBorrowerId = BorrowerService.insertWithUserNames({
        borrower,
        userId: user._id,
      });

      const expectedBorrower = {
        ...borrower,
        _id: newBorrowerId,
        firstName,
        lastName,
      };

      expect(Borrowers.findOne(newBorrowerId)).and.to.deep.equal(expectedBorrower);
    });
  });

  describe('smartInsert', () => {
    beforeEach(() => {
      Factory.create('borrower', { userId: user._id });

      sinon.stub(BorrowerService, 'insert');
      sinon.stub(BorrowerService, 'insertWithUserNames');
    });

    afterEach(() => {
      BorrowerService.insert.restore();
      BorrowerService.insertWithUserNames.restore();
    });

    it('calls BorrowerService.insertWithUserNames when there is no borrower for the provided userId', () => {
      Borrowers.remove({});

      expect(BorrowerService.insertWithUserNames.called).to.equal(false);

      BorrowerService.smartInsert({ borrower, userId: user._id });

      expect(BorrowerService.insertWithUserNames.getCall(0).args).to.deep.equal([{ borrower, userId: user._id }]);
    });

    it('calls BorrowerService.insert when there is at least one borrower for the provided userId', () => {
      expect(BorrowerService.insert.called).to.equal(false);
      expect(BorrowerService.insertWithUserNames.called).to.equal(false);

      BorrowerService.smartInsert({ borrower, userId: user._id });

      expect(BorrowerService.insertWithUserNames.called).to.equal(false);
      expect(BorrowerService.insert.callCount).to.equal(1);
      expect(BorrowerService.insert.getCall(0).args).to.deep.equal([
        { borrower, userId: user._id },
      ]);
    });
  });
});
