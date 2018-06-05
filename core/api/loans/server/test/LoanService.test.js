/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import sinon from 'sinon';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import Loans from '../../loans';
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
        { loanId, object: { userFormsDisabled: true } },
      ]);

      LoanService.update.restore();
    });
  });

  describe('enableUserForms', () => {
    it('enables the user forms', () => {
      sinon.stub(LoanService, 'update');

      Loans.update({ _id: loanId }, { $set: { userFormsDisabled: true } });
      expect(Loans.findOne(loanId).userFormsDisabled).to.equal(true);

      expect(LoanService.update.called).to.equal(false);
      LoanService.enableUserForms({ loanId });
      expect(LoanService.update.getCall(0).args).to.deep.equal([
        { loanId, object: { userFormsDisabled: false } },
      ]);

      LoanService.update.restore();
    });
  });
});
