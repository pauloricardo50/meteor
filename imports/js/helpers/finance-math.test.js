import { expect } from 'chai';
import { describe, it } from 'meteor/practicalmeteor:mocha';

import {
  getYearsToRetirement,
  getAmortization,
  getInterests,
  getMaintenance,
  getMonthlyPayment,
  getBonusIncome,
  getOtherIncome,
  getExpenses,
  getBorrowerIncome,
  getRatio,
} from './finance-math';

describe('Finance Math', () => {
  describe('Calculate Years to Retirement', () => {
    it('Should return 35 with a male of 30 yo', () => {
      expect(getYearsToRetirement(30, undefined, 'm', undefined)).to.equal(35);
    });

    it('Should return 34 with a female of 30 yo', () => {
      expect(getYearsToRetirement(30, undefined, 'f', undefined)).to.equal(34);
    });

    it('Should return 35 with an undefined gender of 30 yo', () => {
      expect(
        getYearsToRetirement(30, undefined, undefined, undefined),
      ).to.equal(35);
    });

    it('Should return 0 with a female of 64 yo', () => {
      expect(getYearsToRetirement(64, undefined, 'f', undefined)).to.equal(0);
    });

    it('Should return 0 with a female over 64 yo', () => {
      expect(getYearsToRetirement(80, undefined, 'f', undefined)).to.equal(0);
    });

    it('Should return 10 with a female of 54 yo and male of 54 yo', () => {
      expect(getYearsToRetirement(54, 54, 'f', 'm')).to.equal(10);
    });
  });

  describe('Get Amortization', () => {
    it('Should return 1000 for a 1200000 property', () => {
      // const request = {
      //   property: {
      //     value: 1200000,
      //   },
      //   general: {
      //     fortuneUsed: 300000,
      //     insuranceFortuneUsed: 0,
      //   },
      // };
      //
      // const borrowers = [
      //   {
      //     age: 30,
      //     gender: 'm',
      //   },
      // ];
      // expect(getAmortization(request, borrowers)).to.equal(1000);
    });
  });
});
