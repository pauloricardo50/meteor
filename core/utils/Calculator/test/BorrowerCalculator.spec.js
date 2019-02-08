// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import Calculator from '..';
import { BORROWER_DOCUMENTS, STEPS, GENDER } from 'core/api/constants';
import { DOCUMENTS } from '../../../api/constants';
import { initialDocuments } from '../../../api/borrowers/borrowersAdditionalDocuments';

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
        loan: {
          borrowers: [
            {
              documents: {},
              _id: 'docId',
              additionalDocuments: initialDocuments,
            },
          ],
        },
      })).to.equal(0);
    });

    it('should not be 0% when adding data', () => {
      expect(Calculator.getBorrowerCompletion({
        loan: {
          borrowers: [
            {
              firstName: 'joe',
              lastName: 'johnson',
              documents: {},
              logic: {},
              _id: 'docId',
              additionalDocuments: initialDocuments,
            },
          ],
        },
      })).to.be.within(0.01, 0.1);
    });

    it('should not be 0% when adding a document', () => {
      expect(Calculator.getBorrowerCompletion({
        loan: {
          borrowers: [
            {
              documents: { [DOCUMENTS.IDENTITY]: [{}] },
              logic: {},
              _id: 'docId',
              additionalDocuments: initialDocuments,
            },
          ],
        },
      })).to.be.within(0.01, 0.1);
    });

    it('should count files and info', () => {
      expect(Calculator.getBorrowerCompletion({
        loan: {
          borrowers: [
            {
              firstName: 'joe',
              lastName: 'johnson',
              documents: { [DOCUMENTS.IDENTITY]: [{}] },
              logic: {},
              _id: 'borrowerId',
              additionalDocuments: initialDocuments,
            },
          ],
        },
      })).to.be.within(0.14, 0.15);
    });
  });

  describe('getBorrowerFilesProgress', () => {
    it('returns 0 when no file is present', () => {
      expect(Calculator.getBorrowerFilesProgress({
        loan: {
          borrowers: [
            {
              documents: {},
              _id: 'borrowerId',
              additionalDocuments: initialDocuments,
            },
          ],
        },
      })).to.deep.equal({ percent: 0, count: 6 });
    });

    it('returns 0 when no documents are present', () => {
      expect(Calculator.getBorrowerFilesProgress({
        loan: {
          borrowers: [{}],
        },
      })).to.deep.equal({ percent: 0, count: 1 });
    });

    it('returns more than 0 when a file is present', () => {
      expect(Calculator.getBorrowerFilesProgress({
        loan: {
          borrowers: [
            {
              documents: { [DOCUMENTS.IDENTITY]: [{}] },
              _id: 'borrowerId',
              additionalDocuments: initialDocuments,
            },
          ],
        },
      })).to.deep.equal({ percent: 1 / 6, count: 6 });
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
    it('properly sums insurance2, insurance3A, insurance3B and bank3A', () => {
      expect(Calculator.getInsuranceFortune({
        borrowers: {
          insurance2: [{ value: 2 }],
          insurance3A: [{ value: 3 }],
          insurance3B: [{ value: 4 }],
          bank3A: [{ value: 5 }],
        },
      })).to.equal(14);

      expect(Calculator.getInsuranceFortune({
        borrowers: {
          insurance3B: [{ value: 2 }],
          bank3A: [{ value: undefined }],
        },
      })).to.equal(2);
    });

    it('works with multiple borrowers', () => {
      expect(Calculator.getInsuranceFortune({
        borrowers: [
          {
            insurance2: [{ value: 2 }],
            insurance3A: [{ value: 3 }],
          },
          {
            bank3A: [{ value: 4 }],
            insurance3B: [{ value: 5 }],
          },
        ],
      })).to.equal(14);
    });
  });

  describe('getMissingBorrowerDocuments', () => {
    it('returns all missing ids for an empty borrower', () => {
      expect(Calculator.getMissingBorrowerDocuments({
        loan: {
          borrowers: [{ _id: 'borrowerId', additionalDocuments: initialDocuments }],
          logic: { step: STEPS.PREPARATION },
        },
      })).to.deep.equal(initialDocuments.map(({ id }) => id));
    });
  });

  describe('getMissingBorrowerFields', () => {
    it('returns all missing ids for an empty borrower', () => {
      expect(Calculator.getMissingBorrowerFields({ borrowers: {} })).to.deep.equal([
        'firstName',
        'lastName',
        'gender',
        'address1',
        'city',
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
      expect(Calculator.getTotalFunds({
        borrowers: {
          bankFortune: 1,
          insurance2: [{ value: 2 }],
          insurance3A: [{ value: 3 }],
        },
      })).to.equal(6);
    });
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
          salary: 100,
          netSalary: 80,
          bankFortune: 1000,
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

  describe('getYearsToRetiement', () => {
    it('returns the proper difference for a male', () => {
      expect(Calculator.getRetirement({
        borrowers: [{ age: 25, gender: GENDER.M }],
      })).to.equal(40);
    });

    it('returns 0 for a retired person', () => {
      expect(Calculator.getRetirement({
        borrowers: [{ age: 70, gender: GENDER.M }],
      })).to.equal(0);
    });
  });
});
