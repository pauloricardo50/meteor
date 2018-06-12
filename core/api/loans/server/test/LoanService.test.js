/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { Loans, Borrowers, Properties } from '../../..';
import { stubCollections, generateData } from '../../../../utils/testHelpers';
import LoanService from '../../LoanService';

let loanId;

describe('LoanService', () => {
  beforeEach(() => {
    resetDatabase();
    stubCollections();

    const {
      loan: { _id },
    } = generateData();
    loanId = _id;

    expect(loanId).to.be.a('string');
  });

  afterEach(() => {
    stubCollections.restore();
  });

  describe('disableUserForms', () => {
    it('calls `LoanService.update` with the correct params', () => {
      sinon.stub(LoanService, 'update');

      expect(LoanService.update.called).to.equal(false);
      LoanService.disableUserForms({ loanId });

      expect(LoanService.update.getCall(0).args).to.deep.equal([
        { loanId, object: { userFormsEnabled: false } },
      ]);

      LoanService.update.restore();
    });
  });

  describe('enableUserForms', () => {
    it('enables the user forms', () => {
      sinon.stub(LoanService, 'update');

      expect(LoanService.update.called).to.equal(false);
      LoanService.enableUserForms({ loanId });

      expect(LoanService.update.getCall(0).args).to.deep.equal([
        { loanId, object: { userFormsEnabled: true } },
      ]);

      LoanService.update.restore();
    });
  });

  describe('adminLoanInsert', () => {
    let userId;

    beforeEach(() => {
      stubCollections.restore();
      stubCollections();
      resetDatabase();
      userId = 'testId';
    });

    it('inserts a property, borrower and loan with same userId', () => {
      expect(Loans.find({}).count()).to.equal(0, 'loans 0');
      expect(Borrowers.find({}).count()).to.equal(0, 'borrowers 0');
      expect(Properties.find({}).count()).to.equal(0, 'properties 0');

      LoanService.adminLoanInsert({ userId });

      expect(Loans.find({}).count()).to.equal(1, 'loans 1');
      expect(Borrowers.find({}).count()).to.equal(1, 'borrowers 1');
      expect(Properties.find({}).count()).to.equal(1, 'properties 1');
    });

    it('adds the same userId on all 3 documents', () => {
      LoanService.adminLoanInsert({ userId });

      expect(Loans.findOne({}).userId).to.equal(userId, 'loans userId');
      expect(Borrowers.findOne({}).userId).to.equal(userId, 'borrowers userId');
      expect(Properties.findOne({}).userId).to.equal(
        userId,
        'properties userId',
      );
    });
  });
});
