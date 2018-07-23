/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { generateData } from '../../../../utils/testHelpers';
import { disableUserFormsHandler, enableUserFormsHandler } from '../methods';
import LoanService from '../../LoanService';

let userId;
let adminId;

describe('Loan methods', () => {
  beforeEach(() => {
    resetDatabase();

    const { user, admin } = generateData();
    userId = user._id;
    adminId = admin._id;

    [userId, adminId].forEach((variable) => {
      expect(variable).to.be.a('string');
    });
  });

  describe('disableUserForms', () => {
    beforeEach(() => {
      sinon.stub(LoanService, 'disableUserForms');
    });

    afterEach(() => {
      LoanService.disableUserForms.restore();
    });

    it('calls `LoanService.disableUserForms` in order to disable the user forms', () => {
      const loanId = 'aFakeLoanId';

      expect(LoanService.disableUserForms.called).to.equal(false);
      disableUserFormsHandler({ userId: adminId }, { loanId });
      expect(LoanService.disableUserForms.getCall(0).args).to.deep.equal([
        { loanId },
      ]);
    });

    it(`throws and does not call 'LoanService.disableUserForms'
        when current user is a non-admin`, () => {
      const loanId = 'aFakeLoanId';

      expect(LoanService.disableUserForms.called).to.equal(false);
      expect(() => disableUserFormsHandler({ userId }, { loanId })).to.throw();
      expect(LoanService.disableUserForms.called).to.equal(false);
    });
  });

  describe('enableUserForms', () => {
    beforeEach(() => {
      sinon.stub(LoanService, 'enableUserForms');
    });

    afterEach(() => {
      LoanService.enableUserForms.restore();
    });

    it('calls `LoanService.enableUserForms` in order to enable the user forms', () => {
      const loanId = 'aFakeLoanId';

      expect(LoanService.enableUserForms.called).to.equal(false);
      enableUserFormsHandler({ userId: adminId }, { loanId });
      expect(LoanService.enableUserForms.getCall(0).args).to.deep.equal([
        { loanId },
      ]);
    });

    it(`throws and does not call 'LoanService.enableUserForms'
        when current user is a non-admin`, () => {
      const loanId = 'aFakeLoanId';

      expect(LoanService.enableUserForms.called).to.equal(false);
      expect(() => enableUserFormsHandler({ userId }, { loanId })).to.throw();
      expect(LoanService.enableUserForms.called).to.equal(false);
    });
  });
});
