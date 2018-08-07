/* eslint-env mocha */
import { expect } from 'chai';

import {
  getYearsToRetirement,
  getAmortization,
  getInterests,
  getMonthlyPayment,
  getTheoreticalMonthly,
  canAffordRank1,
} from '../finance-math';

describe('Finance Math', () => {
  describe('Calculate Years to Retirement', () => {
    it('Should return 35 with a male of 30 yo', () => {
      expect(getYearsToRetirement(30, undefined, 'M', undefined)).to.equal(35);
    });

    it('Should return 34 with a female of 30 yo', () => {
      expect(getYearsToRetirement(30, undefined, 'F', undefined)).to.equal(34);
    });

    it('Should return 35 with an undefined gender of 30 yo', () => {
      expect(getYearsToRetirement(30, undefined, undefined, undefined)).to.equal(35);
    });

    it('Should return 0 with a female of 64 yo', () => {
      expect(getYearsToRetirement(64, undefined, 'F', undefined)).to.equal(0);
    });

    it('Should return 0 with a female over 64 yo', () => {
      expect(getYearsToRetirement(80, undefined, 'F', undefined)).to.equal(0);
    });

    it('Should return 10 with a female of 54 yo and male of 54 yo', () => {
      expect(getYearsToRetirement(54, 54, 'F', 'M')).to.equal(10);
    });
  });

  describe('Get Amortization', () => {
    it('Should return 1000 for a 1200000 property', () => {
      const loan = {
        general: { fortuneUsed: 300000, insuranceFortuneUsed: 0 },
        logic: {},
      };
      const borrowers = [{ age: 30, gender: 'M' }];
      const property = { value: 1200000 };

      expect(Math.round(getAmortization({ loan, borrowers, property }).amortization)).to.equal(1000);
    });

    it('Should return 0 when borrowing less than 65%', () => {
      const loan = {
        general: { fortuneUsed: 400000, insuranceFortuneUsed: 0 },
        logic: {},
      };
      const property = { value: 1000000 };

      const borrowers = [{ age: 30, gender: 'M' }];

      expect(getAmortization({ loan, borrowers, property }).amortization).to.equal(0);
    });
  });

  describe('getInterests', () => {
    it('throws an error if loan is negative', () => {
      expect(() => getInterests({}, 0, -1)).to.throw();
    });

    it('returns the correct value', () => {
      const loan = 100000;
      expect(getInterests({}, 0, loan)).to.equal((loan * 0.015) / 12);
    });

    it('uses the interestRate', () => {
      const loan = 100000;
      const rate = 0.01;
      expect(getInterests({}, rate, loan)).to.equal((loan * rate) / 12);
    });
  });

  describe('getMonthlyPayment', () => {
    it('returns an object', () => {
      expect(typeof getMonthlyPayment({
        property: { value: 100 },
        loan: { general: {}, logic: {} },
        borrowers: [{}],
      })).to.equal('object');
    });

    it('returns a total and the 3 values that make the total', () => {
      const value = getMonthlyPayment({
        property: { value: 100 },
        loan: { general: {}, logic: {} },
        borrowers: [],
      });

      expect(Object.keys(value).length).to.equal(4);
      expect(value.total).to.equal(value.amortization + value.interests + value.maintenance);
    });
  });

  describe('getTheoreticalMonthly', () => {
    it('returns an object', () => {
      expect(typeof getTheoreticalMonthly({
        property: { value: 100 },
        loan: { general: {}, logic: {} },
        borrowers: [],
      })).to.equal('object');
    });

    it('returns a total and the 3 values that make the total', () => {
      const value = getTheoreticalMonthly({
        property: { value: 100 },
        loan: { general: {}, logic: {} },
        borrowers: [],
      });

      expect(Object.keys(value).length).to.equal(4);
      expect(value.total).to.equal(value.amortization + value.interests + value.maintenance);
    });
  });

  describe('getIncomeRatio', () => {
    it('works');
  });

  describe('canAffordRank1', () => {
    it('returns true for the right conditions', () => {
      expect(canAffordRank1({
        loan: { general: {} },
        property: { value: 1000000 },
        borrowers: { bankFortune: 400000 },
      })).to.equal(true);
    });

    it('returns false for the right conditions', () => {
      expect(canAffordRank1({
        loan: { general: {} },
        property: { value: 1000000 },
        borrowers: { bankFortune: 300000 },
      })).to.equal(false);
    });

    it('should return false if property is not primary and insurance fortune should be used', () => {
      expect(canAffordRank1({
        loan: { general: {} },
        property: { value: 1000000 },
        borrowers: { bankFortune: 300000, insuranceSecondPillar: 200000 },
      })).to.equal(false);
    });

    it('should account for insuranceSecondPillar and insuranceThirdPillar', () => {
      expect(canAffordRank1({
        loan: { general: { residenceType: 'MAIN_RESIDENCE' } },
        property: { value: 1000000 },
        borrowers: { bankFortune: 300000, insuranceSecondPillar: 200000 },
      })).to.equal(true);

      expect(canAffordRank1({
        loan: { general: { residenceType: 'MAIN_RESIDENCE' } },
        property: { value: 1000000 },
        borrowers: { bankFortune: 300000, insuranceThirdPillar: 200000 },
      })).to.equal(true);
    });
  });
});
