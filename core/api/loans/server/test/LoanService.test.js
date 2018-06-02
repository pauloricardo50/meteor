import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
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
    it('disables the user forms', () => {
      expect(Loans.findOne(loanId).userFormsDisabled).to.equal(undefined);
      LoanService.disableUserForms({ loanId });
      expect(Loans.findOne(loanId).userFormsDisabled).to.equal(true);
    });
  });

  describe('enableUserForms', () => {
    it('enables the user forms', () => {
      Loans.update({ _id: loanId }, { $set: { userFormsDisabled: true } });

      expect(Loans.findOne(loanId).userFormsDisabled).to.equal(true);
      LoanService.enableUserForms({ loanId });
      expect(Loans.findOne(loanId).userFormsDisabled).to.equal(false);
    });
  });
});
