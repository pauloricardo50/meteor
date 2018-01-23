/* eslint-env mocha */
import { expect } from 'chai';

import {
  getFortune,
  getInsuranceFortune,
  getBorrowerCompletion,
  getBonusIncome,
  getArrayValues,
  getBorrowerIncome,
  getTotalFortune,
  getRealEstateFortune,
  getRealEstateValue,
  getRealEstateDebt,
  getBorrowerSalary,
} from '../borrowerFunctions';

describe('Borrower Functions', () => {
  describe('Get Fortune', () => {
    it('Should return 0 if given an empty object', () => {
      expect(getFortune({})).to.equal(0);
    });

    it('sums bankFortunes if given multiple borrowers', () => {
      expect(getFortune({ borrowers: [{ bankFortune: 1 }, { bankFortune: 2 }] })).to.equal(3);
    });
  });

  describe('getInsuranceFortune', () => {
    it('properly sums insuranceSecondPillar and insuranceThirdPillar', () => {
      expect(getInsuranceFortune({
        borrowers: {
          insuranceSecondPillar: 2,
          insuranceThirdPillar: 3,
        },
      })).to.equal(5);

      expect(getInsuranceFortune({
        borrowers: {
          insuranceSecondPillar: 2,
          insuranceThirdPillar: undefined,
        },
      })).to.equal(2);
    });

    it('works with multiple borrowers', () => {
      expect(getInsuranceFortune({
        borrowers: [
          {
            insuranceSecondPillar: 2,
            insuranceThirdPillar: 3,
          },
          {
            insuranceSecondPillar: 4,
            insuranceThirdPillar: 5,
          },
        ],
      })).to.equal(14);
    });
  });

  describe('getBorrowerCompletion', () => {
    it('returns 0 if given a simple borrower', () => {
      expect(getBorrowerCompletion({ borrowers: { files: {}, logic: {} } })).to.equal(0);
    });

    it('returns 1/3 when logic.hasValidatedFinances is true', () => {
      expect(getBorrowerCompletion({
        borrowers: {
          files: {},
          logic: { hasValidatedFinances: true },
        },
      })).to.equal(1 / 3);
    });

    it('calculates files and personal info progress properly');
  });

  describe('getBonusIncome', () => {
    it('returns 0 if bonus is not defined', () => {
      expect(getBonusIncome({})).to.equal(0);
    });

    it('returns half of 1 bonus', () => {
      expect(getBonusIncome({ borrowers: { bonus: { bonus2014: 100 } } })).to.equal(50);
    });

    it('returns half of average 2 bonuses', () => {
      expect(getBonusIncome({
        borrowers: { bonus: { bonus2014: 100, bonus2015: 0 } },
      })).to.equal(25);
    });

    it('returns half of average 3 bonuses', () => {
      expect(getBonusIncome({
        borrowers: {
          bonus: { bonus2014: 100, bonus2015: 0, bonus2016: 200 },
        },
      })).to.equal(50);
    });

    it('discounts the lowest of 4 bonuses', () => {
      expect(getBonusIncome({
        borrowers: {
          bonus: {
            bonus2014: 100,
            bonus2015: 50,
            bonus2016: 150,
            bonus2017: 40,
          },
        },
      })).to.equal(50);
    });

    it('returns 0 if an invalid bonus is given', () => {
      expect(getBonusIncome({ borrowers: { bonus: { bonus2014: 'hi' } } })).to.equal(0);
    });

    it('throws and error if more than 4 bonuses are provided', () => {
      expect(() =>
        getBonusIncome({
          borrowers: {
            bonus: {
              bonus2014: 100,
              bonus2015: 50,
              bonus2016: 150,
              bonus2017: 40,
              bonus2018: 30,
            },
          },
        })).to.throw('too many');
    });
  });

  describe('getArrayValues', () => {
    it("returns 0 if the key doesn't exist", () => {
      expect(getArrayValues({}, 'key')).to.equal(0);
    });

    it("returns the sum of all value keys in an object's array", () => {
      expect(getArrayValues(
        {
          array: [{ value: 1 }, { value: 2 }],
        },
        'array',
      )).to.equal(3);
    });

    it('works with arrays', () => {
      expect(getArrayValues(
        [
          {
            array: [{ value: 1 }, { value: 2 }],
          },
          {
            array: [{ value: 3 }, { value: 4 }],
          },
        ],
        'array',
      )).to.equal(10);
    });

    it('works with a provided mapFunc', () => {
      expect(getArrayValues(
        [
          {
            array: [{ yo: 1 }, { value: 2 }],
          },
          {
            array: [{ value: 3 }, { yo: 4 }],
          },
        ],
        'array',
        item => item.yo,
      )).to.equal(5);
    });
  });

  describe('getBorrowerIncome', () => {
    it('should return 0 an empty borrower', () => {
      expect(getBorrowerIncome({})).to.equal(0);
    });

    it('should return sum of all incomes for a borrower, and subtract expenses', () => {
      expect(getBorrowerIncome({
        borrowers: {
          salary: 1,
          bonus: { value: 2 }, // returns 1
          otherIncome: [{ value: 3 }],
          expenses: [{ value: 5 }],
        },
      })).to.equal(0);
    });
  });

  describe('getTotalFortune', () => {
    it('should return 0 for an empty object', () => {
      expect(getTotalFortune({})).to.equal(0);
    });

    it('should sum all fortune items in a borrower', () => {
      expect(getTotalFortune({
        borrowers: {
          bankFortune: 1,
          insuranceSecondPillar: 2,
          insuranceThirdPillar: 3,
        },
      })).to.equal(6);
    });
  });

  describe('getRealEstateFortune', () => {
    it('returns the difference between property values and loans', () => {
      expect(getRealEstateFortune({
        borrowers: {
          realEstate: [{ value: 2, loan: 1 }],
        },
      })).to.equal(1);
    });
  });

  describe('getRealEstateValue', () => {
    it('returns value of all realEstate', () => {
      expect(getRealEstateValue({
        borrowers: {
          realEstate: [{ value: 2, loan: 1 }],
        },
      })).to.equal(2);
    });
  });

  describe('getRealEstateValue', () => {
    it('returns loans of all realEstate', () => {
      expect(getRealEstateDebt({
        borrowers: {
          realEstate: [{ value: 2, loan: 1 }],
        },
      })).to.equal(1);
    });
  });

  describe('getBorrowerSalary', () => {
    it('returns 0 for an empty object', () => {
      expect(getBorrowerSalary({})).to.equal(0);
    });

    it("returns sum of borrowers' salary", () => {
      expect(getBorrowerSalary({ borrowers: { salary: 1 } })).to.equal(1);
      expect(getBorrowerSalary({ borrowers: [{ salary: 1 }, { salary: 2 }] })).to.equal(3);
    });
  });
});
