// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { DOCUMENTS, STEPS } from 'core/api/constants';
import { initialDocuments as borrowersInitialDocuments } from 'core/api/borrowers/borrowersAdditionalDocuments';
import { initialDocuments as propertiesInitialDocuments } from 'core/api/properties/propertiesAdditionalDocuments';

import CombinedCalculator from '..';

describe('CombinedCalculator', () => {
  describe('filesProgress', () => {
    it('sums file progress across the loan', () => {
      const property = {
        documents: { [DOCUMENTS.PROPERTY_PLANS]: [{}] },
        _id: 'jo',
        additionalDocuments: propertiesInitialDocuments,
      };
      const progress = CombinedCalculator.filesProgress({
        loan: {
          structure: {
            property,
          },
          borrowers: [
            {
              documents: { [DOCUMENTS.IDENTITY]: [{}] },
              _id: 'id1',
              additionalDocuments: borrowersInitialDocuments,
            },
            {
              documents: { [DOCUMENTS.TAXES]: [{}] },
              _id: 'id2',
              additionalDocuments: borrowersInitialDocuments,
            },
          ],
          properties: [property],
          general: {},
          logic: { step: STEPS.PREPARATION },
        },
      });
      expect(progress.percent).to.be.within(0.14, 0.15);
      expect(progress.count).to.equal(21);
    });
  });
});
