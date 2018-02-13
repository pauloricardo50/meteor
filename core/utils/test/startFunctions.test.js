/* eslint-env mocha */
import { expect } from 'chai';

import {
  getMinIncome,
  getMinFortune,
  getBonusIncome,
  getMonthly,
  getMonthlyReal,
  getRatio,
  getBorrow,
  getRetirement,
  getAmortization,
} from '../startFunctions';
import constants from '../../config/constants';

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

describe('Start 1 Functions', () => {
  describe('Get Min Income', () => {
    it("Should return 157'896 for 250k fortune and 1000M property", () => {
      expect(getMinIncome(1000000, 250000)).to.equal(157896);
    });
  });

  describe('Get Min Fortune', () => {
    it('Should return 250k for 1000M property and lots of fortune', () => {
      expect(getMinFortune(1000000, 500000)).to.equal(250000);
    });

    it('Should return 308k for 1000M property and 140k fortune', () => {
      expect(getMinFortune(1000000, 140000)).to.equal(308286);
    });

    it('Should return 490k for 1000M property and 100k fortune', () => {
      expect(getMinFortune(1000000, 100000)).to.equal(490000);
    });
  });
});

describe('Start Functions', () => {
  describe('Get bonus income', () => {
    it('Should return 250 for 4x 500', () => {
      expect(getBonusIncome([500, 500, 500, 500])).to.equal(250);
    });

    it('Should return 250 for 3x 500 and any value below that', () => {
      expect(getBonusIncome([500, 500, 500, Math.random() * 499])).to.equal(250);
    });

    it('Should ignore any value beyond the 4 first ones', () => {
      expect(getBonusIncome([200, 500, 500, 500, 10000, 10000])).to.equal(250);
    });
  });

  describe('Get Monthly Cost', () => {
    it('Should return roughly 4916 for a 1M property and 250k fortune used', () => {
      const state = {
        fortuneUsed: 250000,
        propertyValue: 1000000,
      };

      // 833.3333 maintenance, 750 amortization, 3333.3333 interests
      expect(getMonthly(state))
        .to.be.above(833 + 800000 * constants.loanCost() / 12)
        .and.to.be.below(834 + 800000 * constants.loanCost() / 12);
    });
  });

  describe('Get Monthly Cost Real', () => {
    it();
  });

  describe('Get Ratio', () => {
    it('Should return 0.38 for an income limited project', () => {
      const income = 200000;
      const state = {
        fortuneUsed: 500000,
        insuranceFortuneUsed: 200000,
        propertyValue: 1583179,
      };
      const totalFortune = state.fortune + state.insuranceFortune;
      const fees =
        state.propertyValue * constants.notaryFees +
        state.insuranceFortune * constants.lppFees;
      const borrow = getBorrow(totalFortune, state.propertyValue, fees);
      const monthly = getMonthly(state, borrow);

      expect(getRatio(income, 0, monthly))
        .to.be.at.most(constants.maxRatio)
        .and.to.be.at.least(constants.maxRatio - 0.1);
    });

    it('Should return 0.38 for an edge case where the ratio could go above 0.38', () => {
      const income = 200000;
      const state = {
        fortuneUsed: 390000,
        insuranceFortuneUsed: 0,
        propertyValue: 1344154,
      };
      const totalFortune = state.fortune + state.insuranceFortune;
      const fees =
        state.propertyValue * constants.notaryFees +
        state.insuranceFortune * constants.lppFees;
      const borrow = getBorrow(totalFortune, state.propertyValue, fees);
      const monthly = getMonthly(state, borrow);

      expect(getRatio(income, 0, monthly)).to.be.at.most(constants.maxRatio);
    });
  });

  describe('Get Retirement', () => {
    it('Should return 100 for undefined values', () => {
      const state = {
        age: undefined,
        gender: undefined,
      };

      expect(getRetirement(state)).to.equal(100);
    });

    it('Should return 10 even without borrowerCount', () => {
      const state = {
        age: 55,
        gender: 'm',
      };

      expect(getRetirement(state)).to.equal(10);
    });

    it('Should return 0 for people older than 65', () => {
      const state = {
        age: 65 + getRandomInt(0, 100),
        gender: 'm',
      };

      expect(getRetirement(state)).to.equal(0);
    });

    it('Should work for multiple borrowers, and ignore single borrower values', () => {
      const state = {
        borrowerCount: 2,
        oldestAge: 60,
        oldestGender: 'f',
        age: 55,
        gender: 'm',
      };

      expect(getRetirement(state)).to.equal(4);
    });
  });

  describe('Get Max Loan', () => {
    it('Should return ');
  });
});
