/* eslint-env mocha */
import { expect } from 'chai';

import { initialDocuments as borrowerDocuments } from '../../../api/borrowers/borrowersAdditionalDocuments';
import { DOCUMENTS } from '../../../api/files/fileConstants';
import { initialDocuments as propertyDocuments } from '../../../api/properties/propertiesAdditionalDocuments';
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
        },
      });
      expect(progress.percent).to.be.within(0.17, 0.18);
      expect(progress.count).to.equal(17);
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
        },
      });
      expect(progress.percent).to.be.within(0.27, 0.28);
      expect(progress.count).to.equal(11);
    });
  });
});
