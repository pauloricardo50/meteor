// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import Calculator from '..';
import { BORROWER_DOCUMENTS } from 'core/api/constants';
import { DOCUMENTS } from '../../../api/constants';

describe('BorrowerCalculator', () => {
  describe('getArrayValues', () => {
    it("returns 0 if the key doesn't exist", () => {
      expect(Calculator.getArrayValues({}, 'key')).to.equal(0);
    });

    it("returns the sum of all value keys in an object's array", () => {
      expect(Calculator.getArrayValues({
        borrowers: {
          array: [{ value: 1 }, { value: 2 }],
        },
        key: 'array',
      })).to.equal(3);
    });

    it('works with arrays', () => {
      expect(Calculator.getArrayValues({
        borrowers: [
          { array: [{ value: 1 }, { value: 2 }] },
          { array: [{ value: 3 }, { value: 4 }] },
        ],
        key: 'array',
      })).to.equal(10);
    });

    it('works with a provided mapFunc', () => {
      expect(Calculator.getArrayValues(
        {
          borrowers: [
            { array: [{ yo: 1 }, { value: 2 }] },
            { array: [{ value: 3 }, { yo: 4 }] },
          ],
          key: 'array',
        },

        item => item.yo,
      )).to.equal(5);
    });
  });

  describe('getBonusIncome', () => {
    it('returns half of 1 bonus', () => {
      expect(Calculator.getBonusIncome({
        borrowers: { bonusExists: true, bonus2018: 100 },
      })).to.equal(50);
    });

    it('returns half of average 2 bonuses', () => {
      expect(Calculator.getBonusIncome({
        borrowers: { bonusExists: true, bonus2018: 100, bonus2015: 0 },
      })).to.equal(25);
    });

    it('returns half of average 3 bonuses', () => {
      expect(Calculator.getBonusIncome({
        borrowers: {
          bonusExists: true,
          bonus2018: 100,
          bonus2017: 0,
          bonus2016: 200,
        },
      })).to.equal(50);
    });

    it('discounts the lowest of 4 bonuses', () => {
      expect(Calculator.getBonusIncome({
        borrowers: {
          bonusExists: true,
          bonus2015: 50,
          bonus2016: 150,
          bonus2017: 40,
          bonus2018: 100,
        },
      })).to.equal(50);
    });

    it('returns 0 if bonusExists is false', () => {
      expect(Calculator.getBonusIncome({
        borrowers: {
          bonusExists: false,
          bonus2015: 50,
          bonus2016: 150,
          bonus2017: 40,
          bonus2018: 100,
        },
      })).to.equal(0);
    });
  });

  describe('getBorrowerCompletion', () => {
    it('should be 0% for a new borrower', () => {
      expect(Calculator.getBorrowerCompletion({
        borrowers: { documents: {}, logic: {} },
      })).to.equal(0);
    });

    it('should not be 0% when adding data', () => {
      expect(Calculator.getBorrowerCompletion({
        borrowers: {
          firstName: 'joe',
          lastName: 'johnson',
          documents: {},
          logic: {},
        },
      }))
        .to.be.above(0.09)
        .and.to.be.below(0.1);
    });

    it('should not be 0% when adding a document', () => {
      expect(Calculator.getBorrowerCompletion({
        borrowers: {
          documents: { [DOCUMENTS.IDENTITY]: [{}] },
          logic: {},
        },
      })).to.equal(0.1);
    });

    it('should count files and info', () => {
      expect(Calculator.getBorrowerCompletion({
        borrowers: {
          firstName: 'joe',
          lastName: 'johnson',
          documents: { [DOCUMENTS.IDENTITY]: [{}] },
          logic: {},
        },
      }))
        .to.be.above(0.19)
        .and.to.be.below(0.2);
    });
  });

  describe('getBorrowerFilesProgress', () => {
    it('returns 0 when no file is present', () => {
      expect(Calculator.getBorrowerFilesProgress({
        borrowers: {
          documents: {},
          logic: {},
        },
      })).to.equal(0);
    });

    it('returns 0 when no documents are present', () => {
      expect(Calculator.getBorrowerFilesProgress({
        borrowers: {},
      })).to.equal(0);
    });

    it('returns more than 0 when a file is present', () => {
      expect(Calculator.getBorrowerFilesProgress({
        borrowers: {
          documents: { [DOCUMENTS.IDENTITY]: [{}] },
          logic: {},
        },
      })).to.equal(0.2);
    });
  });

  describe('getExpenses', () => {
    it('Should return 0 if given an empty object', () => {
      expect(Calculator.getExpenses({})).to.equal(0);
    });

    it('sums expenses array', () => {
      expect(Calculator.getExpenses({
        borrowers: { expenses: [{ value: 2 }, { value: 3 }] },
      })).to.equal(5);
    });
  });

  describe('getFortune', () => {
    it('Should return 0 if given an empty object', () => {
      expect(Calculator.getFortune({})).to.equal(0);
    });

    it('sums bankFortunes if given multiple borrowers', () => {
      expect(Calculator.getFortune({
        borrowers: [{ bankFortune: 1 }, { bankFortune: 2 }],
      })).to.equal(3);
    });
  });

  describe('getInsuranceFortune', () => {
    it('properly sums insuranceSecondPillar and insuranceThirdPillar', () => {
      expect(Calculator.getInsuranceFortune({
        borrowers: {
          insuranceSecondPillar: 2,
          insuranceThirdPillar: 3,
        },
      })).to.equal(5);

      expect(Calculator.getInsuranceFortune({
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
            insurance2: 2,
            insuranceThirdPillar: 3,
          },
          {
            insurance2: 4,
            insuranceThirdPillar: 5,
          },
        ],
      })).to.equal(14);
    })
  });


  describe('getMissingBorrowerDocuments', () => {
    it('returns all missing ids for an empty borrower', () => {
      expect(Calculator.getMissingBorrowerDocuments({ borrowers: {} })).to.deep.equal([
        BORROWER_DOCUMENTS.IDENTITY,
        BORROWER_DOCUMENTS.RESIDENCY_PERMIT,
        BORROWER_DOCUMENTS.TAXES,
        BORROWER_DOCUMENTS.SALARY_CERTIFICATE,
        BORROWER_DOCUMENTS.OTHER_INCOME_JUSTIFICATION,
      ]);
    });
  });

  describe('getMissingBorrowerFields', () => {
    it('returns all missing ids for an empty borrower', () => {
      expect(Calculator.getMissingBorrowerFields({ borrowers: {} })).to.deep.equal([
        'firstName',
        'lastName',
        'gender',
        'address1',
        'zipCode',
        'isSwiss',
        'age',
        'citizenship',
        'isUSPerson',
        'civilStatus',
        'childrenCount',
      ]);
    });
  });

  describe('getOtherFortune', () => {
    it('Should return 0 if given an empty object', () => {
      expect(Calculator.getOtherFortune({})).to.equal(0);
    });

    it('sums otherFortune if given multiple borrowers', () => {
      expect(Calculator.getOtherFortune({
        borrowers: [
          { otherFortune: [{ value: 3 }, { value: 4 }] },
          { otherFortune: [{ value: 5 }, { value: 6 }] },
        ],
      })).to.equal(18);

    });
  });

  describe('getRealEstateFortune', () => {
    it('returns the difference between property values and loans', () => {
      expect(Calculator.getRealEstateFortune({
        borrowers: {
          realEstate: [{ value: 2, loan: 1 }],
        },
      })).to.equal(1);
    });
  });

  describe('getRealEstateValue', () => {
    it('returns value of all realEstate', () => {
      expect(Calculator.getRealEstateValue({
        borrowers: {
          realEstate: [{ value: 2, loan: 1 }],
        },
      })).to.equal(2);
    });
  });

  describe('getRealEstateValue', () => {
    it('returns loans of all realEstate', () => {
      expect(Calculator.getRealEstateDebt({
        borrowers: {
          realEstate: [{ value: 2, loan: 1 }],
        },
      })).to.equal(1);
    });
  });

  describe('getSalary', () => {
    it('returns 0 for an empty object', () => {
      expect(Calculator.getSalary({})).to.equal(0);
    });

    it("returns sum of borrowers' salary", () => {
      expect(Calculator.getSalary({ borrowers: { salary: 1 } })).to.equal(1);
      expect(Calculator.getSalary({
        borrowers: [{ salary: 1 }, { salary: 2 }],
      })).to.equal(3);
    });
  });

  describe('getTotalFunds', () => {
    it('should return 0 for an empty object', () => {
      expect(Calculator.getTotalFunds({})).to.equal(0);
    });


    it('should sum all fortune items in a borrower', () => {
      expect(BorrowerCalculator.getTotalFunds({
        borrowers: {
          bankFortune: 1,
          insurance2: 2,
          insuranceThirdPillar: 3,
        },
      })).to.equal(6);
    })
  });

  describe('getTotalIncome', () => {
    it('should return 0 an empty borrower', () => {
      expect(Calculator.getTotalIncome({})).to.equal(0);
    });

    it('should return sum of all incomes for a borrower, and subtract expenses', () => {
      expect(Calculator.getTotalIncome({
        borrowers: {
          salary: 1,
          bonusExists: true,
          bonus2018: 2, // Adds 1
          otherIncome: [{ value: 3 }],
          expenses: [{ value: 5 }], // Subtracts 5
        },
      })).to.equal(0);
    });
  });

  describe('personalInfoPercent', () => {
    it('works', () => {
      expect(Calculator.personalInfoPercent({
        borrowers: {
          _id: 'aBcNvYnq34rnb29nh',
          adminValidation: {},
          age: 45,
          bonusExists: false,
          childrenCount: 0,
          citizenship: 'hello',
          civilStatus: 'MARRIED',
          corporateBankExists: false,
          createdAt: '2018-08-23T10:18:18.139Z',
          expenses: [],
          firstName: 'dfadf',
          gender: 'M',
          isSwiss: false,
          isUSPerson: false,
          lastName: 'asdfasd',
          logic: { adminValidated: false },
          otherFortune: [],
          otherIncome: [],
          realEstate: [],
          residencyPermit: 'b',
          sameAddress: true,
          updatedAt: '2018-08-23T10:20:22.234Z',
          userId: 'fAksm7pJveZybme5F',
        },
      })).to.equal(1);
    });
  });

  describe('sumValues', () => {
    it('sums values with a single key', () => {
      expect(Calculator.sumValues({
        borrowers: [{ a: 1 }, { a: 2 }],
        keys: 'a',
      })).to.equal(3);
    });

    it('sums values with multiple keys', () => {
      expect(Calculator.sumValues({
        borrowers: [{ a: 1, b: 4 }, { a: 2, b: 3 }],
        keys: ['a', 'b'],
      })).to.equal(10);
    });
    it('omits keys if they are not provided', () => {
      expect(Calculator.sumValues({ borrowers: [{ a: 1 }, {}], keys: 'a' })).to.equal(1);
    });
  });
});
