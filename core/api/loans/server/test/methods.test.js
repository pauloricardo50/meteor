import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import sinon from 'sinon';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';

import {
  stubCollections,
  generateData,
  getMethodHandler,
} from '../../../../utils/testHelpers';
import { disableUserForms, enableUserForms } from '../../../../api/methods';

import { Loans } from '../../loans';
import LoanService from '../../LoanService';

let adminId;
let userId;
let loanId;

describe.only('Loan methods', () => {
  beforeEach(() => {
    resetDatabase();
    stubCollections();

    const { admin, user, loan } = generateData();

    adminId = admin._id;
    userId = user._id;
    loanId = loan._id;

    // make sure these actually exist
    [adminId, userId, loanId].forEach((variable) => {
      expect(variable).to.be.a('string');
    });
  });

  afterEach(() => {
    Meteor.userId.restore();
  });

  describe('disableUserForms', () => {
    beforeEach(() => {
      sinon.stub(LoanService, 'disableUserForms');
    });

    afterEach(() => {
      LoanService.disableUserForms.restore();
    });

    it('calls `LoanService.disableUserForms` when current user is admin', () => {
      sinon.stub(Meteor, 'userId').callsFake(() => adminId);

      const methodHandler = getMethodHandler('disableUserForms');
      methodHandler.call({ userId: adminId }, { loanId });

      expect(LoanService.disableUserForms.getCall(0).args).to.deep.equal([
        { loanId },
      ]);
    });

    it('throws and does not call `LoanService.disableUserForms` for non-admin users', () => {
      sinon.stub(Meteor, 'userId').callsFake(() => userId);

      const methodHandler = getMethodHandler('disableUserForms');

      expect(() => methodHandler.call({ userId }, { loanId })).to.throw();
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

    it('calls `LoanService.enableUserForms` when current user is admin', () => {
      sinon.stub(Meteor, 'userId').callsFake(() => adminId);

      const methodHandler = getMethodHandler('enableUserForms');
      methodHandler.call({ userId: adminId }, { loanId });

      expect(LoanService.enableUserForms.getCall(0).args).to.deep.equal([
        { loanId },
      ]);
    });

    it('throws and does not call `LoanService.enableUserForms` for non-admin users', () => {
      sinon.stub(Meteor, 'userId').callsFake(() => userId);

      const methodHandler = getMethodHandler('enableUserForms');

      expect(() => methodHandler.call({ userId }, { loanId })).to.throw();
      expect(LoanService.enableUserForms.called).to.equal(false);
    });
  });
});
