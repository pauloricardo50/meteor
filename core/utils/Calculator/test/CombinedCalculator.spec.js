// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { DEFAULT_AMORTIZATION } from '../../../config/financeConstants';

import CombinedCalculator from '..';

describe('CombinedCalculator', () => {
  describe('getMonthlyWithOffer', () => {
    let loan;
    let offer;
    let property;

    beforeEach(() => {
      loan = {
        general: {
          loanTranches: [{ value: 720000, type: 'test' }],
          fortuneUsed: 250000,
        },
        logic: {},
        structure: { wantedLoan: 800000, property: { value: 1000000 } },
      };
      offer = { standardOffer: {}, counterpartOffer: {} };
    });

    it('returns 0 if interests is wrong', () => {
      expect(CombinedCalculator.getMonthlyWithOffer({ property, loan, offer })).to.equal(0);
    });

    it('returns the right value if everything is wired up', () => {
      offer.standardOffer.test = 0.01;
      expect(CombinedCalculator.getMonthlyWithOffer({ property, loan, offer })).to.equal(Math.round((5000 + 800000 * DEFAULT_AMORTIZATION + 600) / 12));
    });
  });
});
