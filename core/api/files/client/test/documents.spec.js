/* eslint-env mocha */
import { expect } from 'chai';

import { STEPS } from '../../../loans/loanConstants';
import { initialDocuments as propertyDocuments } from '../../../properties/propertiesAdditionalDocuments';
import {
  getBorrowerDocuments,
  getLoanDocuments,
  getPropertyDocuments,
} from '../../documents';
import { DOCUMENTS } from '../../fileConstants';

describe('documents', () => {
  describe('getPropertyDocuments', () => {
    let loan;

    beforeEach(() => {
      loan = {
        step: STEPS.SOLVENCY,
        properties: [
          {
            _id: 'propertyId',
            additionalDocuments: propertyDocuments,
          },
        ],
      };
    });

    it('returns an empty array if no propertyId is specified', () => {
      expect(getPropertyDocuments({ loan })).to.deep.equal([]);
    });

    it('returns an array of documents for the first step', () => {
      expect(
        getPropertyDocuments({ loan, id: 'propertyId' }).map(({ id }) => id),
      ).to.deep.equal([
        ...propertyDocuments.map(({ id }) => id),
        DOCUMENTS.OTHER,
      ]);
    });

    it('adds additionalDocuments to it', () => {
      loan.properties[0].additionalDocuments = [
        { id: 'someId' },
        { id: 'someId2' },
      ];
      expect(
        getPropertyDocuments({ loan, id: 'propertyId' }).map(({ id }) => id),
      ).to.deep.equal(['someId', 'someId2', DOCUMENTS.OTHER]);
    });
  });

  describe('borrowerDocuments', () => {
    let loan;

    beforeEach(() => {
      loan = {
        borrowers: [{ _id: 'borrowerId' }],
        step: STEPS.SOLVENCY,
      };
    });

    it('returns an empty array if no Id is provided', () => {
      expect(getBorrowerDocuments({ loan })).to.deep.equal([]);
    });
  });

  describe('getLoanDocuments', () => {
    it('returns documents for the loan', () => {
      expect(
        getLoanDocuments({
          loan: { general: {} },
        }).map(({ id }) => id),
      ).to.deep.equal([DOCUMENTS.OTHER]);
    });
  });
});
