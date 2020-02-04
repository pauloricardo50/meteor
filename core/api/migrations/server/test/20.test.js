//      
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { EXPENSES } from 'core/api/borrowers/borrowerConstants';
import Borrowers from '../../../borrowers';
import { up, down } from '../20';
import BorrowerService from '../../../borrowers/server/BorrowerService';

describe('Migration 20', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('up', () => {
    it('migrates thirdPartyFortune to donation', async () => {
      await Borrowers.rawCollection().insert({
        _id: 'b1',
        thirdPartyFortune: 1000,
        additionalDocuments: [{ id: 'doc1' }],
      });

      await Borrowers.rawCollection().insert({
        _id: 'b2',
      });

      await up();

      const borrower1 = BorrowerService.get('b1', {
        thirdPartyFortune: 1,
        donation: 1,
        additionalDocuments: 1,
      });
      const borrower2 = BorrowerService.get('b2', {
        thirdPartyFortune: 1,
        donation: 1,
        additionalDocuments: 1,
      });

      expect(borrower1.thirdPartyFortune).to.equal(undefined);
      expect(borrower1.donation.length).to.equal(1);
      expect(borrower1.donation[0]).to.deep.equal({
        value: 1000,
        description: '',
      });
      expect(borrower1.additionalDocuments.length).to.equal(4);
      expect(borrower1.additionalDocuments[1].id).to.equal(
        'DONATION_JUSTIFICATION_CERTIFICATE',
      );
      expect(borrower1.additionalDocuments[2].id).to.equal(
        'DONATION_JUSTIFICATION_IDENTITY',
      );
      expect(borrower1.additionalDocuments[3].id).to.equal(
        'DONATION_JUSTIFICATION_STATEMENT',
      );
      expect(borrower2.donation.length).to.equal(0);
    });

    it('migrates THIRD_PARTY_FORTUNE_REIMBURSEMENT to THIRD_PARTY_LOAN_REIMBURSEMENT', async () => {
      await Borrowers.rawCollection().insert({
        _id: 'b1',
        expenses: [
          { description: 'a', value: 1 },
          { description: 'THIRD_PARTY_FORTUNE_REIMBURSEMENT', value: 2 },
          { description: 'b', value: 3 },
        ],
      });

      await Borrowers.rawCollection().insert({
        _id: 'b2',
      });

      await up();

      const borrower1 = BorrowerService.get('b1', { expenses: 1 });
      const borrower2 = BorrowerService.get('b2', { expenses: 1 });

      expect(borrower1.expenses.length).to.equal(3);
      expect(borrower1.expenses).to.deep.equal([
        { description: 'a', value: 1 },
        { description: EXPENSES.THIRD_PARTY_LOAN_REIMBURSEMENT, value: 2 },
        { description: 'b', value: 3 },
      ]);

      expect(borrower2.expenses).to.equal(undefined);
    });
  });

  describe('down', () => {
    it('migrates back donation to thirdPartyFortune', async () => {
      await Borrowers.rawCollection().insert({
        _id: 'b1',
        donation: [{ value: 1000 }, { value: 500 }],
      });

      await Borrowers.rawCollection().insert({
        _id: 'b2',
      });

      await down();

      const borrower1 = BorrowerService.get('b1', { donation: 1, thirdPartyFortune: 1 });
      const borrower2 = BorrowerService.get('b2', { donation: 1, thirdPartyFortune: 1 });

      expect(borrower1.donation).to.equal(undefined);
      expect(borrower1.thirdPartyFortune).to.equal(1500);
      expect(borrower2.thirdPartyFortune).to.equal(undefined);
    });

    it('migrates back THIRD_PARTY_LOAN_REIMBURSEMENT to THIRD_PARTY_FORTUNE_REIMBURSEMENT', async () => {
      await Borrowers.rawCollection().insert({
        _id: 'b1',
        expenses: [
          { description: 'a', value: 1 },
          { description: EXPENSES.THIRD_PARTY_LOAN_REIMBURSEMENT, value: 2 },
          { description: 'b', value: 3 },
        ],
      });

      await Borrowers.rawCollection().insert({
        _id: 'b2',
      });

      await down();

      const borrower1 = BorrowerService.get('b1', { expenses: 1 });
      const borrower2 = BorrowerService.get('b2', { expenses: 1 });

      expect(borrower1.expenses.length).to.equal(3);
      expect(borrower1.expenses).to.deep.equal([
        { description: 'a', value: 1 },
        { description: 'THIRD_PARTY_FORTUNE_REIMBURSEMENT', value: 2 },
        { description: 'b', value: 3 },
      ]);

      expect(borrower2.expenses).to.equal(undefined);
    });
  });
});
