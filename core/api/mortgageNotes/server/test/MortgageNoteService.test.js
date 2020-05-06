import { Factory } from 'meteor/dburles:factory';

/* eslint-env mocha */
import { expect } from 'chai';

import { resetDatabase } from '../../../../utils/testHelpers';
import LoanService from '../../../loans/server/LoanService';
import MortgageNoteService from '../MortgageNoteService';

describe('MortgageNoteService', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('remove hooks', () => {
    it('deletes mortgageNote references from any loan', () => {
      const mortgageNoteId = Factory.create('mortgageNote')._id;
      const borrowerId = Factory.create('borrower', {
        mortgageNoteLinks: [{ _id: mortgageNoteId }],
      })._id;
      const loanId = Factory.create('loan', {
        borrowerIds: [borrowerId],
        structures: [{ mortgageNoteIds: [mortgageNoteId], id: '1' }],
      })._id;

      MortgageNoteService.remove(mortgageNoteId);

      expect(MortgageNoteService.find({}).count()).to.equal(0);

      const loan = LoanService.get(loanId, {
        structures: { mortgageNoteIds: 1 },
      });
      expect(loan.structures[0].mortgageNoteIds).to.deep.equal([]);
    });
  });
});
