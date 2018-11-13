// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import {
  getAmortizationForStructureWithOffer,
  getMonthlyForStructureWithOffer,
} from '../offerPickerHelpers';

describe.only('offerPickerHelpers', () => {
  describe('getAmortizationForStructureWithOffer', () => {
    it('returns correct amortization for a structure', () => {
      const props = {
        loan: {},
        structure: {
          wantedLoan: 960000,
          propertyWork: 0,
          propertyId: 'prop',
        },
        offer: {
          interest10: 0.01,
          amortizationGoal: 0.5,
          amortizationYears: 20,
        },
        properties: [{ _id: 'prop', value: 1200000 }],
      };
      expect(getAmortizationForStructureWithOffer(props)).to.equal(1500);
    });
  });

  describe('getMonthlyForStructureWithOffer', () => {
    it('test name', () => {
      const props = {
        loan: {},
        structure: {
          wantedLoan: 960000,
          propertyWork: 0,
          loanTranches: [{ type: 'interest10', value: 1 }],
          propertyId: 'prop',
        },
        offer: {
          interest10: 0.01,
          amortizationGoal: 0.5,
          amortizationYears: 20,
        },
        properties: [{ _id: 'prop', value: 1200000, monthlyExpenses: 1000 }],
      };

      // 1000 property costs
      // 1500 amortization
      // 800 interests

      expect(getMonthlyForStructureWithOffer(props)).to.equal(1000 + 1500 + 800);
    });
  });
});
