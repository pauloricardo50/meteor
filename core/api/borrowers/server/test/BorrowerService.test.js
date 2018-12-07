/* eslint-env mocha */
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { expect } from 'chai';

import { DOCUMENTS } from 'core/api/constants';
import BorrowerService from '../../BorrowerService';
import { initialDocuments } from '../../borrowersAdditionalDocuments';
import * as borrowerConstants from '../../borrowerConstants';

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

describe('BorrowerService', () => {
  let borrower;
  let user;

  beforeEach(() => {
    resetDatabase();
    borrower = Factory.create('borrower');
  });

  describe('update', () => {
    it('updates', () => {
      expect(borrower.firstName).to.not.equal('bob');

      BorrowerService._update({
        id: borrower._id,
        object: { firstName: 'bob' },
      });

      const { firstName } = BorrowerService.get(borrower._id);

      expect(firstName).to.equal('bob');
    });
  });

  describe('additional documents', () => {
    it('adds initial documents when borrower is created', () => {
      const { additionalDocuments } = BorrowerService.get(borrower._id);
      expect(additionalDocuments).to.deep.equal(initialDocuments);
    });

    it('adds conditional documents when condition is met', () => {
      BorrowerService._update({
        id: borrower._id,
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
      ];

      checkDocuments({
        additionalDocuments,
        expectedDocuments,
        shouldCheckRequiredByAdmin: false,
      });
    });

    it('does not add conditional documents when condition is not met', () => {
      BorrowerService._update({
        id: borrower._id,
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
      const { additionalDocuments } = BorrowerService.get(borrower._id);

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
        id: borrower._id,
        object: {
          isSwiss: false,
          bonusExists: true,
          insurance2: [{ description: 'insurance2', value: 123 }],
          bank3A: [{ description: 'bank3a', value: 123 }],
          insurance3A: [],
          insurance3B: [],
          expenses: [
            {
              description: borrowerConstants.EXPENSES.MORTGAGE_LOAN,
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
        id: borrower._id,
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
      const { additionalDocuments } = BorrowerService.get(borrower._id);

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
        id: borrower._id,
        additionalDocId: 'testDoc',
        requiredByAdmin: true,
      });
      const { additionalDocuments } = BorrowerService.get(borrower._id);

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
        id: borrower._id,
        additionalDocId: 'testDoc',
        requiredByAdmin: false,
      });
      const { additionalDocuments } = BorrowerService.get(borrower._id);

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
        id: borrower._id,
        additionalDocId: DOCUMENTS.IDENTITY,
        requiredByAdmin: true,
      });
      const { additionalDocuments } = BorrowerService.get(borrower._id);

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
        id: borrower._id,
        additionalDocId: DOCUMENTS.IDENTITY,
        requiredByAdmin: false,
      });
      const { additionalDocuments } = BorrowerService.get(borrower._id);

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
        id: borrower._id,
        additionalDocId: 'testDoc',
        requiredByAdmin: true,
        label: 'test label',
      });
      const { additionalDocuments } = BorrowerService.get(borrower._id);

      expect(additionalDocuments).to.deep.contain({
        id: 'testDoc',
        requiredByAdmin: true,
        label: 'test label',
      });
    });
  });
});
