// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { DOCUMENTS, STEPS } from 'core/api/constants';
import { initialDocuments as borrowerDocuments } from 'core/api/borrowers/borrowersAdditionalDocuments';
import { initialDocuments as propertyDocuments } from 'core/api/properties/propertiesAdditionalDocuments';

import Calculator from '..';

describe('CombinedCalculator', () => {
  describe('filesProgress', () => {
    it('sums file progress across the loan', () => {
      const property = {
        documents: { [DOCUMENTS.PROPERTY_PLANS]: [{}] },
        _id: 'jo',
        additionalDocuments: propertyDocuments,
      };
      const progress = Calculator.filesProgress({
        loan: {
          structure: {
            property,
          },
          borrowers: [
            {
              documents: { [DOCUMENTS.IDENTITY]: [{}] },
              _id: 'id1',
              additionalDocuments: borrowerDocuments,
            },
            {
              documents: { [DOCUMENTS.TAXES]: [{}] },
              _id: 'id2',
              additionalDocuments: borrowerDocuments,
            },
          ],
          properties: [property],
          step: STEPS.SOLVENCY,
        },
      });
      expect(progress.percent).to.be.within(0.15, 0.16);
      expect(progress.count).to.equal(19);
    });

    it('skips the property if there is none', () => {
      const progress = Calculator.filesProgress({
        loan: {
          structure: {},
          borrowers: [
            {
              documents: { [DOCUMENTS.IDENTITY]: [{}] },
              _id: 'id1',
              additionalDocuments: borrowerDocuments,
            },
            {
              documents: {
                [DOCUMENTS.TAXES]: [{}],
                [DOCUMENTS.IDENTITY]: [{}],
              },
              _id: 'id2',
              additionalDocuments: borrowerDocuments,
            },
          ],
          step: STEPS.SOLVENCY,
        },
      });
      expect(progress.percent).to.be.within(0.23, 0.24);
      expect(progress.count).to.equal(13);
    });
  });
});
