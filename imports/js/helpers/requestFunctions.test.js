import { expect } from 'chai';
import { describe, it } from 'meteor/practicalmeteor:mocha';

import {
  getProjectValue,
  getLoanValue,
  loanStrategySuccess,
} from './requestFunctions';

describe('Request functions', () => {
  describe('Get project value', () => {
    it('Should return 1.25M with 1M property and 200k property work', () => {
      const request = {
        general: {},
        property: { value: 1000000, propertyWork: 200000 },
      };

      expect(getProjectValue(request)).to.equal(1250000);
    });

    it('Should return 1.27M with 1M property, 200k property work, and 200k insuranceFortuneUsed and a primary residence', () => {
      const request = {
        general: { insuranceFortuneUsed: 200000, usageType: 'primary' },
        property: { value: 1000000, propertyWork: 200000 },
      };

      expect(getProjectValue(request)).to.equal(1270000);
    });

    it('Should return 1.25M with 1M property, 200k property work, and 200k insuranceFortuneUsed for a non primary residence', () => {
      const request = {
        general: { insuranceFortuneUsed: 200000, usageType: 'investment' },

        property: { value: 1000000, propertyWork: 200000 },
      };

      expect(getProjectValue(request)).to.equal(1250000);
    });

    it('Should return 0 with 0 property, any property work, and any insuranceFortuneUsed', () => {
      const request = {
        general: { insuranceFortuneUsed: 1000 * Math.random() },

        property: { value: 0, propertyWork: 1000 * Math.random() },
      };

      expect(getProjectValue(request)).to.equal(0);
    });

    it('Should return 0 with any negative property value, any property work, and any insuranceFortuneUsed', () => {
      const request = {
        general: { insuranceFortuneUsed: 1000 * Math.random() },

        property: {
          value: (-100) * Math.random(),
          propertyWork: 1000 * Math.random(),
        },
      };

      expect(getProjectValue(request)).to.equal(0);
    });
  });

  describe('Get loan value', () => {
    it("Should return 800'000 with 1M property, 250k cash", () => {
      const loanRequest = {
        general: { fortuneUsed: 250000, insuranceFortuneUsed: 0 },
        property: { value: 1000000 },
      };

      expect(getLoanValue(loanRequest)).to.equal(800000);
    });

    it("Should return 800'000 with 1M property, 250k cash", () => {
      const loanRequest = {
        general: { fortuneUsed: 250000, insuranceFortuneUsed: 0 },
        property: { value: 1000000 },
      };

      expect(getLoanValue(loanRequest)).to.equal(800000);
    });

    it("Should return 600'000 with 1M property, 270k fortune, 200k insurance fortune", () => {
      const loanRequest = {
        general: {
          fortuneUsed: 270000,
          insuranceFortuneUsed: 200000,
          usageType: 'primary',
        },
        property: { value: 1000000 },
      };

      expect(getLoanValue(loanRequest)).to.equal(600000);
    });
  });

  describe('Loan strategy success', () => {
    it('Should properly verify a loan strategy is complete');
  });
});
