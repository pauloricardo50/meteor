import { expect } from 'chai';
import { describe, it, beforeEach } from 'meteor/practicalmeteor:mocha';

import constants from '/imports/js/config/constants';
import {
  getProjectValue,
  getLoanValue,
  loanStrategySuccess,
  getMonthlyWithOffer,
  isRequestValid,
} from '../requestFunctions';

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
        general: { insuranceFortuneUsed: 200000 },
        property: {
          value: 1000000,
          propertyWork: 200000,
          usageType: 'primary',
        },
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
          value: -100 * Math.random(),
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

    it("Should return 600'000 with 1M property, 270k fortune, 200k insurance fortune", () => {
      const loanRequest = {
        general: {
          fortuneUsed: 270000,
          insuranceFortuneUsed: 200000,
        },
        property: { value: 1000000, usageType: 'primary' },
      };

      expect(getLoanValue(loanRequest)).to.equal(600000);
    });

    it("Should return 700'000 with 1M property, 260k fortune, 100k insurance fortune", () => {
      const loanRequest = {
        general: {
          fortuneUsed: 260000,
          insuranceFortuneUsed: 100000,
        },
        property: { value: 1000000, usageType: 'primary' },
      };

      expect(getLoanValue(loanRequest)).to.equal(700000);
    });
  });

  describe('Loan strategy success', () => {
    it('Should properly verify a loan strategy is complete with one value', () => {
      expect(loanStrategySuccess([{ type: 'libor', value: 100 }], 100)).to.be.true;
    });

    it('Should properly verify a loan strategy is complete with two values', () => {
      expect(
        loanStrategySuccess(
          [{ type: 'libor', value: 100 }, { type: 'interest10', value: 100 }],
          200,
        ),
      ).to.be.true;
    });

    it('Should return false if no loanTranche was given', () => {
      expect(loanStrategySuccess([], 200)).to.be.false;
    });
  });

  describe('Get monthly with offer', () => {
    let fortuneUsed;
    let insuranceFortuneUsed;
    let request;
    let tranches;
    let amortization;
    let interestRates;

    beforeEach(() => {
      fortuneUsed = 250000;
      insuranceFortuneUsed = 0;
      request = {
        property: { value: 1000000 },
        general: { fortuneUsed },
      };
      tranches = [{ type: 'interestLibor', value: 800000 }];
      amortization = constants.amortization;
      interestRates = {
        interestLibor: 0.01,
        interest5: 0.01,
        interest10: 0.015,
        interest15: 0.02,
      };
    });

    it('Should return 1917 for a basic setup', () => {
      expect(
        getMonthlyWithOffer(
          request,
          fortuneUsed,
          insuranceFortuneUsed,
          tranches,
          interestRates,
          amortization,
        ),
      ).to.equal(1917);
    });

    it('Should return 2250 for a basic setup', () => {
      tranches = [{ type: 'interest10', value: 800000 }];
      expect(
        getMonthlyWithOffer(
          request,
          fortuneUsed,
          insuranceFortuneUsed,
          tranches,
          interestRates,
          amortization,
        ),
      ).to.equal(2250);
    });

    it('Should return 2083 for a basic setup', () => {
      tranches = [{ type: 'interest10', value: 400000 }, { type: 'interestLibor', value: 400000 }];
      expect(
        getMonthlyWithOffer(
          request,
          fortuneUsed,
          insuranceFortuneUsed,
          tranches,
          interestRates,
          amortization,
        ),
      ).to.equal(2083);
    });

    it('Should return 2021 for a basic setup', () => {
      tranches = [{ type: 'interest10', value: 700000 }];
      expect(
        getMonthlyWithOffer(
          request,
          350000,
          insuranceFortuneUsed,
          tranches,
          interestRates,
          amortization,
        ),
      ).to.equal(2021);
    });

    it("Should return 0 if an interest rate isn't specified", () => {
      tranches = [{ type: 'invalidInterestName', value: 800000 }];
      expect(
        getMonthlyWithOffer(
          request,
          fortuneUsed,
          insuranceFortuneUsed,
          tranches,
          interestRates,
          amortization,
        ),
      ).to.equal(0);
    });
  });

  describe('isRequestValid', () => {
    let request;
    let borrowers;
    let fortuneUsed;
    let insuranceFortuneUsed;
    let tranches;
    let amortization;
    let interestRates;

    beforeEach(() => {
      fortuneUsed = 250000;
      insuranceFortuneUsed = 0;
      request = {
        property: { value: 1000000 },
        general: { fortuneUsed },
        logic: {},
      };
      borrowers = [{ salary: 100000 }];
    });

    it('should throw for insufficient revenues', () => {
      expect(() => isRequestValid(request, borrowers)).to.throw('income');
    });

    it('should throw for insufficient cash', () => {
      // 150k is required here
      request.general.fortuneUsed = 140000;
      request.general.insuranceFortuneUsed = 250000;
      borrowers = [{ salary: 300000 }];
      expect(() => isRequestValid(request, borrowers)).to.throw('cash');
    });

    it('should throw for insufficient own funds', () => {
      request.general.fortuneUsed = 160000;
      request.general.insuranceFortuneUsed = 80000;
      borrowers = [{ salary: 300000 }];
      expect(() => isRequestValid(request, borrowers)).to.throw('ownFunds');
    });
  });
});
