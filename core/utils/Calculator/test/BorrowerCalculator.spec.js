// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import BorrowerCalculator from '..';

describe('BorrowerCalculator', () => {
  describe('sumValues', () => {
    it('sums values with a single key', () => {
      expect(BorrowerCalculator.sumValues({
        borrowers: [{ a: 1 }, { a: 2 }],
        keys: 'a',
      })).to.equal(3);
    });

    it('sums values with multiple keys', () => {
      expect(BorrowerCalculator.sumValues({
        borrowers: [{ a: 1, b: 4 }, { a: 2, b: 3 }],
        keys: ['a', 'b'],
      })).to.equal(10);
    });
    it('omits keys if they are not provided', () => {
      expect(BorrowerCalculator.sumValues({ borrowers: [{ a: 1 }, {}], keys: 'a' })).to.equal(1);
    });
  });

  describe('Get Fortune', () => {
    it('Should return 0 if given an empty object', () => {
      expect(BorrowerCalculator.getFortune({})).to.equal(0);
    });

    it('sums bankFortunes if given multiple borrowers', () => {
      expect(BorrowerCalculator.getFortune({
        borrowers: [{ bankFortune: 1 }, { bankFortune: 2 }],
      })).to.equal(3);
    });
  });

  describe('getInsuranceFortune', () => {
    it('properly sums insuranceSecondPillar and insuranceThirdPillar', () => {
      expect(BorrowerCalculator.getInsuranceFortune({
        borrowers: {
          insuranceSecondPillar: 2,
          insuranceThirdPillar: 3,
        },
      })).to.equal(5);

      expect(BorrowerCalculator.getInsuranceFortune({
        borrowers: {
          insuranceSecondPillar: 2,
          insuranceThirdPillar: undefined,
        },
      })).to.equal(2);
    });

    it('works with multiple borrowers', () => {
      expect(BorrowerCalculator.getInsuranceFortune({
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

  describe('getBorrowersCompletion', () => {
    it('returns 0 if given a simple borrower', () => {
      expect(BorrowerCalculator.getBorrowersCompletion({
        borrowers: { files: {}, logic: {} },
      })).to.equal(0);
    });
  });

  describe('getBonusIncome', () => {
    it('returns 0 if bonus is not defined', () => {
      expect(BorrowerCalculator.getBonusIncome({})).to.equal(0);
    });

    it('returns half of 1 bonus', () => {
      expect(BorrowerCalculator.getBonusIncome({
        borrowers: { bonus: { bonus2014: 100 } },
      })).to.equal(50);
    });

    it('returns half of average 2 bonuses', () => {
      expect(BorrowerCalculator.getBonusIncome({
        borrowers: { bonus: { bonus2014: 100, bonus2015: 0 } },
      })).to.equal(25);
    });

    it('returns half of average 3 bonuses', () => {
      expect(BorrowerCalculator.getBonusIncome({
        borrowers: {
          bonus: { bonus2014: 100, bonus2015: 0, bonus2016: 200 },
        },
      })).to.equal(50);
    });

    it('discounts the lowest of 4 bonuses', () => {
      expect(BorrowerCalculator.getBonusIncome({
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
      expect(BorrowerCalculator.getBonusIncome({
        borrowers: { bonus: { bonus2014: 'hi' } },
      })).to.equal(0);
    });

    it('throws and error if more than 4 bonuses are provided', () => {
      expect(() =>
        BorrowerCalculator.getBonusIncome({
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
      expect(BorrowerCalculator.getArrayValues({}, 'key')).to.equal(0);
    });

    it("returns the sum of all value keys in an object's array", () => {
      expect(BorrowerCalculator.getArrayValues({
        borrowers: {
          array: [{ value: 1 }, { value: 2 }],
        },
        key: 'array',
      })).to.equal(3);
    });

    it('works with arrays', () => {
      expect(BorrowerCalculator.getArrayValues({
        borrowers: [
          {
            array: [{ value: 1 }, { value: 2 }],
          },
          {
            array: [{ value: 3 }, { value: 4 }],
          },
        ],
        key: 'array',
      })).to.equal(10);
    });

    it('works with a provided mapFunc', () => {
      expect(BorrowerCalculator.getArrayValues(
        {
          borrowers: [
            {
              array: [{ yo: 1 }, { value: 2 }],
            },
            {
              array: [{ value: 3 }, { yo: 4 }],
            },
          ],
          key: 'array',
        },

        item => item.yo,
      )).to.equal(5);
    });
  });

  describe('getTotalIncome', () => {
    it('should return 0 an empty borrower', () => {
      expect(BorrowerCalculator.getTotalIncome({})).to.equal(0);
    });

    it('should return sum of all incomes for a borrower, and subtract expenses', () => {
      expect(BorrowerCalculator.getTotalIncome({
        borrowers: {
          salary: 1,
          bonus: { value: 2 }, // returns 1
          otherIncome: [{ value: 3 }],
          expenses: [{ value: 5 }],
        },
      })).to.equal(2);
    });
  });

  describe('getTotalFunds', () => {
    it('should return 0 for an empty object', () => {
      expect(BorrowerCalculator.getTotalFunds({})).to.equal(0);
    });

    it('should sum all fortune items in a borrower', () => {
      expect(BorrowerCalculator.getTotalFunds({
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
      expect(BorrowerCalculator.getRealEstateFortune({
        borrowers: {
          realEstate: [{ value: 2, loan: 1 }],
        },
      })).to.equal(1);
    });
  });

  describe('getRealEstateValue', () => {
    it('returns value of all realEstate', () => {
      expect(BorrowerCalculator.getRealEstateValue({
        borrowers: {
          realEstate: [{ value: 2, loan: 1 }],
        },
      })).to.equal(2);
    });
  });

  describe('getRealEstateValue', () => {
    it('returns loans of all realEstate', () => {
      expect(BorrowerCalculator.getRealEstateDebt({
        borrowers: {
          realEstate: [{ value: 2, loan: 1 }],
        },
      })).to.equal(1);
    });
  });

  describe('getBorrowerSalary', () => {
    it('returns 0 for an empty object', () => {
      expect(BorrowerCalculator.getBorrowerSalary({})).to.equal(0);
    });

    it("returns sum of borrowers' salary", () => {
      expect(BorrowerCalculator.getBorrowerSalary({ borrowers: { salary: 1 } })).to.equal(1);
      expect(BorrowerCalculator.getBorrowerSalary({
        borrowers: [{ salary: 1 }, { salary: 2 }],
      })).to.equal(3);
    });
  });
});
