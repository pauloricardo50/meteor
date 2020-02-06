/* eslint-env mocha */
import { expect } from 'chai';

import { getAvailableRates } from '../FinancingOffersSorterContainer';

describe('FinancingOffersSorterContainer', () => {
  describe('getAvailableRates', () => {
    it('discards rates at 0', () => {
      expect(
        getAvailableRates([{ interest10: 1, interest2: 0 }], {
          structures: [],
        }),
      ).to.deep.equal(['interest10']);
    });

    it('filters duplicate rates', () => {
      expect(
        getAvailableRates(
          [
            { interest10: 1, interest2: 0 },
            { interest10: 1, interest2: 0 },
          ],
          { structures: [] },
        ),
      ).to.deep.equal(['interest10']);
    });

    it('adds all rates on structures', () => {
      expect(
        getAvailableRates([], {
          structures: [
            {
              loanTranches: [{ type: 'interest10', value: 1 }],
            },
            {
              loanTranches: [{ type: 'interest2', value: 1 }],
            },
          ],
        }),
      ).to.deep.equal(['interest10', 'interest2']);
    });
  });
});
