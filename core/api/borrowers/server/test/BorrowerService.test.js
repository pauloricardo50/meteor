/* eslint-env mocha */
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { expect } from 'chai';

import { DOCUMENTS } from 'core/api/constants';
import BorrowerService from '../BorrowerService';
import { initialDocuments } from '../../borrowersAdditionalDocuments';
import * as borrowerConstants from '../../borrowerConstants';
import LoanService from '../../../loans/server/LoanService';
import MortgageNoteService from '../../../mortgageNotes/server/MortgageNoteService';

const checkDocuments = ({
  additionalDocuments,
  expectedDocuments,
  shouldCheckRequiredByAdmin = true,
}) => {
  expect(additionalDocuments.length).to.equal(expectedDocuments.length);
  expect(expectedDocuments.every(doc =>
    additionalDocuments.find(({ id, requiredByAdmin }) =>
      id === doc.id
          && shouldCheckRequiredByAdmin
          && requiredByAdmin === doc.requiredByAdmin))).to.exist;
  expect(additionalDocuments.find(doc =>
    expectedDocuments.every(({ id }) => id !== doc.id))).to.not.exist;
};

describe('BorrowerService ', () => {
  let borrower;
  let borrowerId;
  let user;

  beforeEach(() => {
    resetDatabase();
    borrower = Factory.create('borrower');
    borrowerId = borrower._id;
  });

  describe('update', () => {
    it('updates', () => {
      expect(borrower.firstName).to.not.equal('bob');

      BorrowerService._update({
        id: borrowerId,
        object: { firstName: 'bob' },
      });

      const { firstName } = BorrowerService.get(borrower._id);

      expect(firstName).to.equal('bob');
    });
  });

  describe('delete', () => {
    it('removes a borrower', () => {
      BorrowerService.remove({ borrowerId });

      expect(BorrowerService.find({}).count()).to.equal(0);
    });

    it('deletes the borrower if it only has one loan', () => {
      Factory.create('loan', { borrowerIds: [borrowerId] });

      BorrowerService.remove({ borrowerId });

      expect(BorrowerService.find({}).count()).to.equal(0);
    });

    it('deletes the borrower if it only has one loan and loanId is passed', () => {
      const loanId = Factory.create('loan', { borrowerIds: [borrower._id] });

      BorrowerService.remove({ borrowerId, loanId });

      expect(BorrowerService.find({}).count()).to.equal(0);
    });

    it('only removes the link if the borrower has multiple loans', () => {
      const loanId = Factory.create('loan', { borrowerIds: [borrowerId] })._id;
      const loanId2 = Factory.create('loan', { borrowerIds: [borrowerId] })._id;

      BorrowerService.remove({ borrowerId, loanId });

      expect(BorrowerService.find({}).count()).to.equal(1);

      const loan = LoanService.get(loanId);
      expect(loan.borrowerIds).to.deep.equal([]);

      const loan2 = LoanService.get(loanId2);
      expect(loan2.borrowerIds).to.deep.equal([borrowerId]);
    });

    it('removes references of mortgageNotes from loans', () => {
      const mortgageNoteId = Factory.create('mortgageNote')._id;
      Factory.create('loan', {
        borrowerIds: [borrowerId],
        structures: [{ mortgageNoteIds: [mortgageNoteId], id: '1' }],
      });
      Factory.create('loan', {
        borrowerIds: [borrowerId],
        structures: [
          { mortgageNoteIds: [mortgageNoteId, 'someOtherNote'], id: '2' },
        ],
      });
      BorrowerService.addLink({
        id: borrowerId,
        linkName: 'mortgageNotes',
        linkId: mortgageNoteId,
      });

      BorrowerService.remove({ borrowerId });

      expect(BorrowerService.find({}).count()).to.equal(0, 'borrowers');
      expect(LoanService.find({}).count()).to.equal(2, 'loans');
      expect(MortgageNoteService.find({}).count()).to.equal(0, 'mortgageNotes');

      LoanService.find({}).forEach(({ structures }) => {
        expect(structures[0].mortgageNoteIds.every(id => id !== mortgageNoteId)).to.equal(true);
      });
    });
  });

  describe('additional documents', () => {
    it('adds initial documents when borrower is created', () => {
      const { additionalDocuments } = BorrowerService.get(borrowerId);
      expect(additionalDocuments).to.deep.equal(initialDocuments);
    });

    it('adds conditional documents when condition is met', () => {
      BorrowerService._update({
        id: borrowerId,
        object: {
          isSwiss: false,
          bonusExists: true,
          insurance2: [{ description: 'insurance2', value: 123 }],
          bank3A: [{ description: 'bank3a', value: 123 }],
          insurance3A: [],
          insurance3B: [],
          expenses: [
            {
              description: borrowerConstants.EXPENSES.PERSONAL_LOAN,
              value: 123,
            },
          ],
          realEstate: [{ value: 456, loan: 123 }],
          otherFortune: [{ description: 'otherFortune', value: 123 }],
          otherIncome: [
            { description: borrowerConstants.OTHER_INCOME.WELFARE, value: 123 },
          ],
          donation: [{ value: 123, description: 'donation' }],
          thirdPartyLoan: [{ value: 456, description: 'thirdPartyLoan', amortizationYears: 5, yearlyInterest: 0.1 }],
        },
      });
      const { additionalDocuments } = BorrowerService.get(borrower._id);
      const expectedDocuments = [
        ...initialDocuments,
        { id: DOCUMENTS.RESIDENCY_PERMIT },
        { id: DOCUMENTS.BONUSES },
        { id: DOCUMENTS.PENSION_FUND_YEARLY_STATEMENT },
        { id: DOCUMENTS.THIRD_PILLAR_ACCOUNTS },
        { id: DOCUMENTS.CURRENT_MORTGAGES },
        { id: DOCUMENTS.EXPENSES_JUSTIFICATION },
        { id: DOCUMENTS.OTHER_FORTUNE_JUSTIFICATION },
        { id: DOCUMENTS.OTHER_INCOME_JUSTIFICATION },
        { id: DOCUMENTS.DONATION_JUSTIFICATION },
        { id: DOCUMENTS.THIRD_PARTY_LOAN_JUSTIFICATION },
      ];

      checkDocuments({
        additionalDocuments,
        expectedDocuments,
        shouldCheckRequiredByAdmin: false,
      });
    });

    it('does not add conditional documents when condition is not met', () => {
      BorrowerService._update({
        id: borrowerId,
        object: {
          isSwiss: false,
          bonusExists: true,
          insurance2: [{ description: 'insurance2', value: 123 }],
          otherFortune: [{ description: 'otherFortune', value: 123 }],
          otherIncome: [
            { description: borrowerConstants.OTHER_INCOME.WELFARE, value: 123 },
          ],
        },
      });
      const { additionalDocuments } = BorrowerService.get(borrowerId);

      const expectedDocuments = [
        ...initialDocuments,
        { id: DOCUMENTS.RESIDENCY_PERMIT },
        { id: DOCUMENTS.BONUSES },
        { id: DOCUMENTS.PENSION_FUND_YEARLY_STATEMENT },
        { id: DOCUMENTS.OTHER_FORTUNE_JUSTIFICATION },
        { id: DOCUMENTS.OTHER_INCOME_JUSTIFICATION },
      ];

      checkDocuments({
        additionalDocuments,
        expectedDocuments,
        shouldCheckRequiredByAdmin: false,
      });
    });

    it('removes conditional documents when condition is not met anymore', () => {
      BorrowerService._update({
        id: borrowerId,
        object: {
          isSwiss: false,
          bonusExists: true,
          insurance2: [{ description: 'insurance2', value: 123 }],
          bank3A: [{ description: 'bank3a', value: 123 }],
          insurance3A: [],
          insurance3B: [],
          expenses: [
            {
              description: borrowerConstants.EXPENSES.PERSONAL_LOAN,
              value: 123,
            },
          ],
          otherFortune: [{ description: 'otherFortune', value: 123 }],
          otherIncome: [
            { description: borrowerConstants.OTHER_INCOME.WELFARE, value: 123 },
          ],
        },
      });
      BorrowerService._update({
        id: borrowerId,
        object: {
          isSwiss: false,
          bonusExists: true,
          bank3A: [],
          expenses: [],
          insurance2: [{ description: 'insurance2', value: 123 }],
          otherFortune: [{ description: 'otherFortune', value: 123 }],
          otherIncome: [
            { description: borrowerConstants.OTHER_INCOME.WELFARE, value: 123 },
          ],
        },
      });
      const { additionalDocuments } = BorrowerService.get(borrowerId);

      const expectedDocuments = [
        ...initialDocuments,
        { id: DOCUMENTS.RESIDENCY_PERMIT },
        { id: DOCUMENTS.BONUSES },
        { id: DOCUMENTS.PENSION_FUND_YEARLY_STATEMENT },
        { id: DOCUMENTS.OTHER_FORTUNE_JUSTIFICATION },
        { id: DOCUMENTS.OTHER_INCOME_JUSTIFICATION },
      ];

      checkDocuments({
        additionalDocuments,
        expectedDocuments,
        shouldCheckRequiredByAdmin: false,
      });
    });
  });

  describe('setAdditionalDoc', () => {
    it('adds additional admin required additional doc', () => {
      BorrowerService.setAdditionalDoc({
        id: borrowerId,
        additionalDocId: 'testDoc',
        requiredByAdmin: true,
      });
      const { additionalDocuments } = BorrowerService.get(borrowerId);

      const expectedDocuments = [
        ...initialDocuments,
        { id: 'testDoc', requiredByAdmin: true },
      ];

      checkDocuments({
        additionalDocuments,
        expectedDocuments,
      });
    });

    it('adds additional admin not required additional doc', () => {
      BorrowerService.setAdditionalDoc({
        id: borrowerId,
        additionalDocId: 'testDoc',
        requiredByAdmin: false,
      });
      const { additionalDocuments } = BorrowerService.get(borrowerId);

      const expectedDocuments = [
        ...initialDocuments,
        { id: 'testDoc', requiredByAdmin: false },
      ];

      checkDocuments({
        additionalDocuments,
        expectedDocuments,
      });
    });

    it('updates additional doc to be required by admin', () => {
      BorrowerService.setAdditionalDoc({
        id: borrowerId,
        additionalDocId: DOCUMENTS.IDENTITY,
        requiredByAdmin: true,
      });
      const { additionalDocuments } = BorrowerService.get(borrowerId);

      const expectedDocuments = [
        ...initialDocuments.filter(({ id }) => id !== DOCUMENTS.IDENTITY),
        { id: DOCUMENTS.IDENTITY, requiredByAdmin: true },
      ];

      checkDocuments({
        additionalDocuments,
        expectedDocuments,
      });
    });

    it('updates additional doc to not be required by admin', () => {
      BorrowerService.setAdditionalDoc({
        id: borrowerId,
        additionalDocId: DOCUMENTS.IDENTITY,
        requiredByAdmin: false,
      });
      const { additionalDocuments } = BorrowerService.get(borrowerId);

      const expectedDocuments = [
        ...initialDocuments.filter(({ id }) => id !== DOCUMENTS.IDENTITY),
        { id: DOCUMENTS.IDENTITY, requiredByAdmin: false },
      ];

      checkDocuments({
        additionalDocuments,
        expectedDocuments,
      });
    });

    it('adds additional doc with label', () => {
      BorrowerService.setAdditionalDoc({
        id: borrowerId,
        additionalDocId: 'testDoc',
        requiredByAdmin: true,
        label: 'test label',
      });
      const { additionalDocuments } = BorrowerService.get(borrowerId);

      expect(additionalDocuments).to.deep.contain({
        id: 'testDoc',
        requiredByAdmin: true,
        label: 'test label',
      });
    });
  });
});
