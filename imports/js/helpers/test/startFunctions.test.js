import { expect } from 'chai';
import { describe, it } from 'meteor/practicalmeteor:mocha';

import {
  getBonusIncome,
  getMonthly,
  getMonthlyReal,
  getRatio,
} from '../startFunctions';
import constants from '../../config/constants';

describe('Start Functions', () => {
  describe('Get bonus income', () => {
    it('Should return 250 for 4x 500', () => {
      expect(getBonusIncome([500, 500, 500, 500])).to.equal(250);
    });

    it('Should return 250 for 3x 500 and any value below that', () => {
      expect(getBonusIncome([500, 500, 500, Math.random() * 499])).to.equal(
        250,
      );
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
      expect(getMonthly(state)).to.be
        .above(833 + 800000 * constants.loanCost() / 12)
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
      const monthly = getMonthly(state);

      expect(getRatio(income, 0, monthly)).to.be.at
        .most(constants.maxRatio)
        .and.to.be.at.least(constants.maxRatio - 0.1);
    });

    it('Should return 0.38 for an edge case where the ratio goes above 0.38', () => {
      const income = 200000;
      const state = {
        fortuneUsed: 390000,
        insuranceFortuneUsed: 0,
        propertyValue: 1344154,
      };
      const monthly = getMonthly(state);

      expect(getRatio(income, 0, monthly)).to.be.at.most(constants.maxRatio);
    });
  });
});
