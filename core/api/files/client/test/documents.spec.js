// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import { STEPS } from 'core/api/constants';
import {
  loanDocuments,
  propertyDocuments,
  borrowerDocuments,
  getPropertyDocuments,
  getBorrowerDocuments,
  getLoanDocuments,
} from '../../documents';
import { DOCUMENTS } from '../../fileConstants';

describe('documents', () => {
  describe('document integrity', () => {
    it('all document ids are defined', () => {
      loanDocuments({ general: {} })
        .all()
        .forEach(({ id }) => {
          expect(id).to.not.equal(undefined);
          expect(typeof id).to.equal('string');
        });

      propertyDocuments({})
        .all()
        .forEach(({ id }) => {
          expect(id).to.not.equal(undefined);
          expect(typeof id).to.equal('string');
        });

      borrowerDocuments({})
        .all()
        .forEach(({ id }) => {
          expect(id).to.not.equal(undefined);
          expect(typeof id).to.equal('string');
        });
    });
  });

  describe('getPropertyDocuments', () => {
    let loan;

    beforeEach(() => {
      loan = {
        logic: { step: STEPS.PREPARATION },
        properties: [{ _id: 'propertyId', additionalDocuments: [] }],
      };
    });

    it('returns an empty array if no propertyId is specified', () => {
      expect(getPropertyDocuments({ loan })).to.deep.equal([]);
    });

    it('returns an array of documents for the first step', () => {
      expect(getPropertyDocuments({ loan, id: 'propertyId' }).map(({ id }) => id)).to.deep.equal([
        DOCUMENTS.PROPERTY_PLANS,
        DOCUMENTS.PROPERTY_VOLUME,
        DOCUMENTS.PROPERTY_PICTURES,
        DOCUMENTS.PROPERTY_MARKETING_BROCHURE,
        DOCUMENTS.OTHER,
      ]);
    });

    it('adds additionalDocuments to it', () => {
      loan.properties[0].additionalDocuments = [
        { id: 'someId' },
        { id: 'someId2' },
      ];
      expect(getPropertyDocuments({ loan, id: 'propertyId' }).map(({ id }) => id)).to.deep.equal([
        DOCUMENTS.PROPERTY_PLANS,
        DOCUMENTS.PROPERTY_VOLUME,
        DOCUMENTS.PROPERTY_PICTURES,
        DOCUMENTS.PROPERTY_MARKETING_BROCHURE,
        'someId',
        'someId2',
        DOCUMENTS.OTHER,
      ]);
    });

    it('returns an array of documents for the second and first steps', () => {
      loan.logic.step = STEPS.GET_CONTRACT;
      expect(getPropertyDocuments({ loan, id: 'propertyId' }).map(({ id }) => id)).to.deep.equal([
        DOCUMENTS.PROPERTY_PLANS,
        DOCUMENTS.PROPERTY_VOLUME,
        DOCUMENTS.PROPERTY_PICTURES,
        DOCUMENTS.PROPERTY_MARKETING_BROCHURE,
        DOCUMENTS.INVESTMENT_PROPERTY_RENT_JUSTIFICATION,
        DOCUMENTS.LAND_REGISTER_EXTRACT,
        DOCUMENTS.COOWNERSHIP_ALLOCATION_AGREEMENT,
        DOCUMENTS.COOWNERSHIP_AGREEMENT,
        DOCUMENTS.FIRE_AND_WATER_INSURANCE,
        DOCUMENTS.OTHER,
      ]);
    });
  });

  describe('borrowerDocuments', () => {
    let loan;

    beforeEach(() => {
      loan = {
        borrowers: [{ _id: 'borrowerId' }],
        logic: { step: STEPS.PREPARATION },
      };
    });

    it('returns an empty array if no Id is provided', () => {
      expect(getBorrowerDocuments({ loan })).to.deep.equal([]);
    });

    it('returns an array of documents for the first step', () => {
      loan.borrowers[0].additionalDocuments = [
        { id: 'someId' },
        { id: 'someId2' },
      ];
      expect(getBorrowerDocuments({ loan, id: 'borrowerId' }).map(({ id }) => id)).to.deep.equal([
        DOCUMENTS.IDENTITY,
        DOCUMENTS.RESIDENCY_PERMIT,
        DOCUMENTS.TAXES,
        DOCUMENTS.SALARY_CERTIFICATE,
        DOCUMENTS.BONUSES,
        DOCUMENTS.OTHER_INCOME_JUSTIFICATION,
        DOCUMENTS.OWN_COMPANY_FINANCIAL_STATEMENTS,
        DOCUMENTS.DIVORCE_RULING,
        DOCUMENTS.EXPENSES_JUSTIFICATION,
        'someId',
        'someId2',
        DOCUMENTS.OTHER,
      ]);
    });
  });

  describe('getLoanDocuments', () => {
    it('returns documents for the loan', () => {
      expect(getLoanDocuments({
        loan: { logic: { step: STEPS.GET_CONTRACT }, general: {} },
      }).map(({ id }) => id)).to.deep.equal([
        DOCUMENTS.SIGNED_MANDATE,
        DOCUMENTS.BUYERS_CONTRACT,
        DOCUMENTS.REIMBURSEMENT_STATEMENT,
        DOCUMENTS.OTHER,
      ]);
    });
  });
});
