// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { DOCUMENTS, STEPS } from 'core/api/constants';

import CombinedCalculator from '..';

describe('CombinedCalculator', () => {
  describe('filesProgress', () => {
    it('sums file progress across the loan', () => {
      const property = {
        documents: { [DOCUMENTS.PROPERTY_PLANS]: [{}] },
        _id: 'jo',
      };
      expect(CombinedCalculator.filesProgress({
        loan: {
          structure: {
            property,
          },
          borrowers: [
            { documents: { [DOCUMENTS.IDENTITY]: [{}] }, _id: 'id1' },
            { documents: { [DOCUMENTS.TAXES]: [{}] }, _id: 'id2' },
          ],
          properties: [property],
          general: {},
          logic: { step: STEPS.PREPARATION },
        },
      })).to.be.within(0.23, 0.24);
    });
  });
});
