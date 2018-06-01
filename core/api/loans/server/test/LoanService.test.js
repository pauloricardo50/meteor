import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import Loan from '../../loans';
import {
  stubCollections,
  generateData,
  getMethodHandler,
} from '../../../../utils/testHelpers';
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

  describe('disableUserForms', () => {
    it('disables the user forms in the database', () => {
      expect(Loan.findOne(loanId).userFormsDisabled).to.equal(undefined);
      LoanService.disableUserForms({ loanId });
      expect(Loan.findOne(loanId).userFormsDisabled).to.equal(true);
    });
  });

  describe('enableUserForms', () => {
    it('enables the user forms in the database', () => {
      Loan.update({ _id: loanId }, { $set: { userFormsDisabled: true } });
      expect(Loan.findOne(loanId).userFormsDisabled).to.equal(true);

      LoanService.enableUserForms({ loanId });
      expect(Loan.findOne(loanId).userFormsDisabled).to.equal(false);
    });
  });
});
