// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { DOCUMENTS } from 'core/api/constants';

import CombinedCalculator from '..';

describe.only('CombinedCalculator', () => {
  describe('filesProgress', () => {
    it('sums file progress across the loan', () => {
      expect(CombinedCalculator.filesProgress({
        loan: {
          structure: {
            property: { documents: { [DOCUMENTS.PROPERTY_PLANS]: [{}] } },
          },
          borrowers: [
            { documents: { [DOCUMENTS.IDENTITY]: [{}] } },
            { documents: { [DOCUMENTS.TAXES]: [{}] } },
          ],
        },
      })).to.be.within(0.23, 0.24);
    });
  });
});
