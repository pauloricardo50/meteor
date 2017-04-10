import { expect } from 'chai';
import { describe, it } from 'meteor/practicalmeteor:mocha';

import constants, { calculatePrimaryProperty } from '../constants';
import { getRatio, getMonthly } from '../../helpers/startFunctions';

describe('Constants', () => {
  describe('Calculate primary property value', () => {
    it('Should return 1M if 250k fortune and 0 insurance fortune', () => {
      expect(calculatePrimaryProperty(250000, 0)).to.equal(1000000);
    });

    it('Should return 1M if 160k fortune and 100k insurance fortune', () => {
      expect(calculatePrimaryProperty(160000, 100000)).to.equal(1000000);
    });

    it('Should return 1.5M if 275k fortune and 500k insurance fortune', () => {
      // 150k cash, 75k notary fees, 50k lppFees
      expect(calculatePrimaryProperty(275000, 500000)).to.equal(1500000);
    });

    it('Should return 0 if 0 fortune and any insurance fortune', () => {
      expect(calculatePrimaryProperty(0, 100000000)).to.equal(0);
    });

    it('Should return 0 if negative fortune and any insurance fortune', () => {
      expect(calculatePrimaryProperty(-100, 100000000)).to.equal(0);
    });

    it('Should return 0 if negative insurance fortune', () => {
      expect(calculatePrimaryProperty(100, -100000000)).to.equal(0);
    });
  });

  describe('Calculate maximum property value', () => {
    it('Should return 1M with 250k fortune, 0 insurance fortune, 500k income', () => {
      expect(constants.maxProperty(500000, 250000, 0, 'primary')).to.equal(
        1000000,
      );
    });

    it('Should return 1M with 350k fortune, 0 insurance fortune, 500k income, and secondary usage', () => {
      expect(constants.maxProperty(500000, 350000, 0, 'secondary')).to.equal(
        1000000,
      );
    });

    it("Should return 1'434'819 with 500k fortune, 0 insurance fortune, 200k income", () => {
      expect(constants.maxProperty(200000, 500000, 0, 'primary')).to.equal(
        1434819,
      );
    });

    it("Should return 1'583'179 with 500k fortune, 200k insurance fortune, 200k income", () => {
      expect(constants.maxProperty(200000, 500000, 200000, 'primary')).to.equal(
        1583179,
      );
    });

    it('Should always have a ratio below the maximum ratio', () => {
      const income = Math.random() * 100000 + 100000;
      const fortune = Math.random() * 200000 + 300000;
      const insuranceFortune = Math.random() * 100000 + 100000;
      const property = constants.maxProperty(
        income,
        fortune,
        insuranceFortune,
        'primary',
      );
      const state = {
        fortuneUsed: fortune,
        insuranceFortuneUsed: insuranceFortune,
        propertyValue: property,
      };
      const monthly = getMonthly(state);

      expect(getRatio(income, 0, monthly)).to.be.at.most(constants.maxRatio);
    });
  });
});
