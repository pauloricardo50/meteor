// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import { STEPS } from 'core/api/constants';
import { initialDocuments as propertyDocuments } from 'core/api/properties/propertiesAdditionalDocuments';
import {
  getPropertyDocuments,
  getBorrowerDocuments,
  getLoanDocuments,
} from '../../documents';
import { DOCUMENTS } from '../../fileConstants';

describe('documents', () => {
  describe('getPropertyDocuments', () => {
    let loan;

    beforeEach(() => {
      loan = {
        logic: { step: STEPS.PREPARATION },
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
      expect(getPropertyDocuments({ loan, id: 'propertyId' }).map(({ id }) => id)).to.deep.equal([
        ...propertyDocuments.map(({ id }) => id),
        DOCUMENTS.OTHER,
      ]);
    });

    it('adds additionalDocuments to it', () => {
      loan.properties[0].additionalDocuments = [
        { id: 'someId' },
        { id: 'someId2' },
      ];
      expect(getPropertyDocuments({ loan, id: 'propertyId' }).map(({ id }) => id)).to.deep.equal(['someId', 'someId2', DOCUMENTS.OTHER]);
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
  });

  describe('getLoanDocuments', () => {
    it('returns documents for the loan', () => {
      expect(getLoanDocuments({
        loan: { general: {} },
      }).map(({ id }) => id)).to.deep.equal([DOCUMENTS.OTHER]);
    });
  });
});
