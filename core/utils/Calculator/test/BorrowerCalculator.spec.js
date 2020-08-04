/* eslint-env mocha */
import { expect } from 'chai';

import { CIVIL_STATUS } from 'core/api/borrowers/borrowerConstants';
import { CANTONS } from 'core/api/loans/loanConstants';

import {
  BORROWER_ACTIVITY_TYPES,
  EXPENSES,
  GENDER,
} from '../../../api/borrowers/borrowerConstants';
import { initialDocuments } from '../../../api/borrowers/borrowersAdditionalDocuments';
import { DOCUMENTS } from '../../../api/files/fileConstants';
import {
  BONUS_ALGORITHMS,
  REAL_ESTATE_INCOME_ALGORITHMS,
} from '../../../config/financeConstants';
import Calculator, { Calculator as CalculatorClass } from '..';

describe('BorrowerCalculator', () => {
  describe('getArrayValues', () => {
    it("returns 0 if the key doesn't exist", () => {
      expect(Calculator.getArrayValues({}, 'key')).to.equal(0);
    });

    it("returns the sum of all value keys in an object's array", () => {
      expect(
        Calculator.getArrayValues({
          borrowers: { array: [{ value: 1 }, { value: 2 }] },
          key: 'array',
        }),
      ).to.equal(3);
    });

    it('works with arrays', () => {
      expect(
        Calculator.getArrayValues({
          borrowers: [
            { array: [{ value: 1 }, { value: 2 }] },
            { array: [{ value: 3 }, { value: 4 }] },
          ],
          key: 'array',
        }),
      ).to.equal(10);
    });

    it('works with a provided mapFunc', () => {
      expect(
        Calculator.getArrayValues(
          {
            borrowers: [
              { array: [{ yo: 1 }, { value: 2 }] },
              { array: [{ value: 3 }, { yo: 4 }] },
            ],
            key: 'array',
          },

          item => item.yo,
        ),
      ).to.equal(5);
    });

    it('does not throw if there is a null value in it', () => {
      expect(
        Calculator.getArrayValues({
          borrowers: { array: [null, { value: 2 }] },
          key: 'array',
        }),
      ).to.equal(2);
    });
  });

  describe.only('getBonusIncome', () => {
    it('returns half of 1 bonus', () => {
      expect(
        Calculator.getBonusIncome({
          borrowers: { bonusExists: true, bonus2018: 100 },
        }),
      ).to.equal(50);
    });

    it('returns half of average 2 bonuses', () => {
      expect(
        Calculator.getBonusIncome({
          borrowers: { bonusExists: true, bonus2018: 100, bonus2015: 0 },
        }),
      ).to.equal(50);
    });

    it('returns half of average 3 bonuses', () => {
      expect(
        Calculator.getBonusIncome({
          borrowers: {
            bonusExists: true,
            bonus2018: 100,
            bonus2017: 0,
            bonus2016: 200,
          },
        }),
      ).to.equal(75);
    });

    it('returns 0 if bonusExists is false', () => {
      expect(
        Calculator.getBonusIncome({
          borrowers: {
            bonusExists: false,
            bonus2015: 50,
            bonus2016: 150,
            bonus2017: 40,
            bonus2018: 100,
          },
        }),
      ).to.equal(0);
    });

    it('considers bonuses differently based on bonusConsideration', () => {
      const calc = new CalculatorClass({ bonusConsideration: 1 });

      expect(
        calc.getBonusIncome({
          borrowers: {
            bonusExists: true,
            bonus2015: 40,
            bonus2016: 150,
            bonus2017: 50,
            bonus2018: 100,
          },
        }),
      ).to.equal(100);
    });

    it('considers fewer bonuses with bonusHistoryToConsider', () => {
      const calc = new CalculatorClass({
        bonusConsideration: 1,
        bonusHistoryToConsider: 1,
      });

      expect(
        calc.getBonusIncome({
          borrowers: {
            bonusExists: true,
            bonus2015: 50,
            bonus2016: 150,
            bonus2017: 40,
            bonus2019: 200,
          },
        }),
      ).to.equal(200);
    });

    it('works with 2 borrowers', () => {
      expect(
        Calculator.getBonusIncome({
          borrowers: [
            {
              bonusExists: true,
              bonus2018: 100,
              bonus2017: 0,
              bonus2016: 200,
            },
            {
              bonusExists: false,
              bonus2018: 100,
              bonus2017: 0,
              bonus2016: 200,
            },
          ],
        }),
      ).to.equal(75);
    });

    it('uses the AVERAGE algorithm', () => {
      const calc = new CalculatorClass({
        bonusConsideration: 1,
        bonusHistoryToConsider: 2,
        bonusAlgorithm: BONUS_ALGORITHMS.AVERAGE,
      });

      expect(
        calc.getBonusIncome({
          borrowers: {
            bonusExists: true,
            bonus2019: 200,
          },
        }),
      ).to.equal(100);
    });

    it('uses the WEAK_AVERAGE algorithm', () => {
      const calc = new CalculatorClass({
        bonusConsideration: 1,
        bonusHistoryToConsider: 3,
        bonusAlgorithm: BONUS_ALGORITHMS.WEAK_AVERAGE,
      });

      expect(
        calc.getBonusIncome({
          borrowers: {
            bonusExists: true,
            bonus2019: 200,
            bonus2018: 200,
            bonus2017: 0,
          },
        }),
      ).to.equal(200);
    });

    it('returns zero if one of the bonuses is undefined with ZERO_IF_UNDEFINED', () => {
      const calc = new CalculatorClass({
        bonusConsideration: 1,
        bonusHistoryToConsider: 3,
        bonusAlgorithm: BONUS_ALGORITHMS.ZERO_IF_UNDEFINED,
      });

      expect(
        calc.getBonusIncome({
          borrowers: {
            bonusExists: true,
            bonus2019: 200,
            bonus2018: 200,
            bonus2017: 0,
            bonus2016: 200,
          },
        }),
      ).to.equal(0);
    });
  });

  describe('getBonuses', () => {
    it('returns the sum of bonuses for a given year', () => {
      expect(
        Calculator.getBonuses({
          borrowers: [
            {
              bonusExists: 10,
              bonus2018: null,
              bonus2016: 200,
            },
            {
              bonusExists: true,
              bonus2017: 5,
              bonus2016: 200,
              bonus2019: 5,
            },
          ],
        }),
      ).to.deep.equal({ bonus2016: 400, bonus2017: 5, bonus2019: 5 });
    });

    it('omits borrowers with bonusExists false', () => {
      expect(
        Calculator.getBonuses({
          borrowers: [
            {
              bonusExists: 10,
              bonus2018: null,
              bonus2016: 200,
            },
            {
              bonusExists: false,
              bonus2017: 5,
              bonus2016: 200,
              bonus2019: 5,
            },
          ],
        }),
      ).to.deep.equal({ bonus2016: 200 });
    });
  });

  describe('getBorrowerCompletion', () => {
    it('should be 0% for a new borrower', () => {
      expect(
        Calculator.getBorrowerCompletion({
          loan: {
            borrowers: [
              {
                documents: {},
                _id: 'docId',
                additionalDocuments: initialDocuments,
              },
            ],
          },
        }),
      ).to.equal(0);
    });

    it('should not be 0% when adding data', () => {
      expect(
        Calculator.getBorrowerCompletion({
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
        }),
      ).to.be.within(0.01, 0.1);
    });

    it('should not be 0% when adding a document', () => {
      expect(
        Calculator.getBorrowerCompletion({
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
        }),
      ).to.be.within(0.01, 0.1);
    });

    it('should count files and info', () => {
      expect(
        Calculator.getBorrowerCompletion({
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
        }),
      ).to.be.within(0.14, 0.15);
    });
  });

  describe('getBorrowerFilesProgress', () => {
    it('returns 0 when no file is present', () => {
      expect(
        Calculator.getBorrowerFilesProgress({
          loan: {
            borrowers: [
              {
                documents: {},
                _id: 'borrowerId',
                additionalDocuments: initialDocuments,
              },
            ],
          },
        }),
      ).to.deep.equal({ percent: 0, count: 5 });
    });

    it('returns 0 when no documents are present', () => {
      expect(
        Calculator.getBorrowerFilesProgress({
          loan: {
            borrowers: [{}],
          },
        }),
      ).to.deep.equal({ percent: 0, count: 1 });
    });

    it('returns more than 0 when a file is present', () => {
      expect(
        Calculator.getBorrowerFilesProgress({
          loan: {
            borrowers: [
              {
                documents: { [DOCUMENTS.IDENTITY]: [{}] },
                _id: 'borrowerId',
                additionalDocuments: initialDocuments,
              },
            ],
          },
        }),
      ).to.deep.equal({ percent: 1 / 5, count: 5 });
    });
  });

  describe('getExpenses', () => {
    it('Should return 0 if given an empty object', () => {
      expect(Calculator.getExpenses({})).to.equal(0);
    });

    it('sums expenses array', () => {
      expect(
        Calculator.getExpenses({
          borrowers: { expenses: [{ value: 2 }, { value: 3 }] },
        }),
      ).to.equal(5);
    });
  });

  describe('getFortune', () => {
    it('Should return 0 if given an empty object', () => {
      expect(Calculator.getFortune({})).to.equal(0);
    });

    it('sums bankFortunes if given multiple borrowers', () => {
      expect(
        Calculator.getFortune({
          borrowers: [
            { bankFortune: [{ value: 1 }] },
            { bankFortune: [{ value: 2 }] },
          ],
        }),
      ).to.equal(3);
    });
  });

  describe('getInsuranceFortune', () => {
    it('properly sums insurance2, insurance3A, insurance3B and bank3A', () => {
      expect(
        Calculator.getInsuranceFortune({
          borrowers: {
            insurance2: [{ value: 2 }],
            insurance3A: [{ value: 3 }],
            insurance3B: [{ value: 4 }],
            bank3A: [{ value: 5 }],
          },
        }),
      ).to.equal(14);

      expect(
        Calculator.getInsuranceFortune({
          borrowers: {
            insurance3B: [{ value: 2 }],
            bank3A: [{ value: undefined }],
          },
        }),
      ).to.equal(2);
    });

    it('works with multiple borrowers', () => {
      expect(
        Calculator.getInsuranceFortune({
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
        }),
      ).to.equal(14);
    });
  });

  describe('getMissingBorrowerDocuments', () => {
    it('returns all missing ids for an empty borrower', () => {
      expect(
        Calculator.getMissingBorrowerDocuments({
          loan: {
            borrowers: [
              { _id: 'borrowerId', additionalDocuments: initialDocuments },
            ],
          },
        }),
      ).to.deep.equal(initialDocuments.map(({ id }) => id));
    });
  });

  describe('getMissingBorrowerFields', () => {
    it('returns all missing ids for an empty borrower', () => {
      expect(
        Calculator.getMissingBorrowerFields({ borrowers: {} }),
      ).to.deep.equal([
        'firstName',
        'lastName',
        'email',
        'phoneNumber',
        'gender',
        'address1',
        'zipCode',
        'city',
        'canton',
        'country',
        'isSwiss',
        'birthDate',
        'citizenship',
        'isUSPerson',
        'civilStatus',
        'childrenCount',
        'activityType',
        'salary',
        'netSalary',
        'bonusExists',
        'hasOwnCompany',
        'bankFortune',
      ]);
    });

    it('returns all missing ids for an empty borrower', () => {
      const result = Calculator.getMissingBorrowerFields({
        borrowers: { hasOwnCompany: true, ownCompanies: [] },
      });
      expect(result).to.include('ownCompanies');
      const result2 = Calculator.getMissingBorrowerFields({
        borrowers: { hasOwnCompany: false, ownCompanies: [] },
      });
      expect(result2).to.not.include('ownCompanies');
    });
  });

  describe('getOtherFortune', () => {
    it('Should return 0 if given an empty object', () => {
      expect(Calculator.getOtherFortune({})).to.equal(0);
    });

    it('sums otherFortune if given multiple borrowers', () => {
      expect(
        Calculator.getOtherFortune({
          borrowers: [
            { otherFortune: [{ value: 3 }, { value: 4 }] },
            { otherFortune: [{ value: 5 }, { value: 6 }] },
          ],
        }),
      ).to.equal(18);
    });
  });

  describe('getRealEstateFortune', () => {
    it('returns the difference between property values and loans', () => {
      expect(
        Calculator.getRealEstateFortune({
          borrowers: { realEstate: [{ value: 2, loan: 1 }] },
        }),
      ).to.equal(1);
    });
  });

  describe('getRealEstateValue', () => {
    it('returns value of all realEstate', () => {
      expect(
        Calculator.getRealEstateValue({
          borrowers: { realEstate: [{ value: 2, loan: 1 }] },
        }),
      ).to.equal(2);
    });
  });

  describe('getRealEstateValue', () => {
    it('returns loans of all realEstate', () => {
      expect(
        Calculator.getRealEstateDebt({
          borrowers: { realEstate: [{ value: 2, loan: 1 }] },
        }),
      ).to.equal(1);
    });
  });

  describe('getRealEstateIncome', () => {
    it('returns realEstate income', () => {
      expect(
        Calculator.getRealEstateIncome({
          borrowers: { realEstate: [{ income: 10 }] },
        }),
      ).to.equal(10);
    });

    it('changes with realEstateIncomeConsideration', () => {
      const calc = new CalculatorClass({
        realEstateIncomeConsideration: 0.5,
      });
      expect(
        calc.getRealEstateIncome({
          borrowers: { realEstate: [{ income: 10 }, { income: 20 }] },
        }),
      ).to.equal(15);
    });
  });

  describe('getSalary', () => {
    it('returns 0 for an empty object', () => {
      expect(Calculator.getSalary({})).to.equal(0);
    });

    it("returns sum of borrowers' salary", () => {
      expect(Calculator.getSalary({ borrowers: { salary: 1 } })).to.equal(1);
      expect(
        Calculator.getSalary({
          borrowers: [{ salary: 1 }, { salary: 2 }],
        }),
      ).to.equal(3);
    });
  });

  describe('getTotalFunds', () => {
    it('should return 0 for an empty object', () => {
      expect(Calculator.getTotalFunds({})).to.equal(0);
    });

    it('should sum all fortune items in a borrower', () => {
      expect(
        Calculator.getTotalFunds({
          borrowers: {
            bankFortune: [{ value: 1 }],
            insurance2: [{ value: 2 }],
            insurance3A: [{ value: 3 }],
          },
        }),
      ).to.equal(6);
    });
  });

  describe('getTotalIncome', () => {
    it('should return 0 an empty borrower', () => {
      expect(Calculator.getTotalIncome({})).to.equal(0);
    });

    it('should return sum of all incomes for a borrower, and subtract expenses', () => {
      expect(
        Calculator.getTotalIncome({
          borrowers: {
            salary: 1,
            bonusExists: true,
            bonus2018: 2, // Adds 1
            otherIncome: [{ value: 3 }],
            expenses: [{ value: 5, description: EXPENSES.LEASING }], // Subtracts 5
          },
        }),
      ).to.equal(0);
    });

    it('adds fortuneReturns if they exist', () => {
      const calc = new CalculatorClass({ fortuneReturnsRatio: 0.01 });
      expect(
        calc.getTotalIncome({
          borrowers: {
            bankFortune: [{ value: 100 }],
            salary: 1,
            bonusExists: true,
            bonus2018: 2, // Adds 1
            otherIncome: [{ value: 3 }],
            expenses: [{ value: 5, description: EXPENSES.LEASING }], // Subtracts 5
          },
        }),
      ).to.equal(1);
    });

    it('should only subtract expenses that are meant to be subtracted', () => {
      const calc = new CalculatorClass({
        expensesSubtractFromIncome: [EXPENSES.LEASING],
      });
      expect(
        calc.getTotalIncome({
          borrowers: {
            salary: 1,
            bonusExists: true,
            bonus2018: 2, // Adds 1
            otherIncome: [{ value: 3 }],
            expenses: [
              { value: 1, description: EXPENSES.LEASING },
              { value: 5, description: EXPENSES.OTHER },
            ],
          },
        }),
      ).to.equal(4);
    });
  });

  describe('personalInfoPercent', () => {
    it('works', () => {
      expect(
        Calculator.personalInfoPercent({
          borrowers: [
            {
              _id: 'aBcNvYnq34rnb29nh',
              birthDate: '1992-04-14',
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
              otherFortune: [],
              otherIncome: [],
              realEstate: [],
              residencyPermit: 'b',
              sameAddress: true,
              updatedAt: '2018-08-23T10:20:22.234Z',
              userId: 'fAksm7pJveZybme5F',
              salary: 100,
              netSalary: 80,
              bankFortune: [{ value: 1000 }],
              hasOwnCompany: false,
              ownCompanies: [],
              activityType: BORROWER_ACTIVITY_TYPES.SALARIED,
              jobActivityRate: 1,
              jobStartDate: new Date(),
              email: 'bob',
              phoneNumber: '1234',
              marriedDate: new Date(),
              job: 'Test',
              company: 'Test',
              worksInSwitzerlandSince: new Date(),
            },
          ],
        }),
      ).to.equal(1);
    });
  });

  describe('sumValues', () => {
    it('sums values with a single key', () => {
      expect(
        Calculator.sumValues({
          borrowers: [{ a: 1 }, { a: 2 }],
          keys: 'a',
        }),
      ).to.equal(3);
    });

    it('sums values with multiple keys', () => {
      expect(
        Calculator.sumValues({
          borrowers: [
            { a: 1, b: 4 },
            { a: 2, b: 3 },
          ],
          keys: ['a', 'b'],
        }),
      ).to.equal(10);
    });

    it('omits keys if they are not provided', () => {
      expect(
        Calculator.sumValues({ borrowers: [{ a: 1 }, {}], keys: 'a' }),
      ).to.equal(1);
    });
  });

  describe('getYearsToRetirement', () => {
    it('returns the proper difference for a male', () => {
      const yearsAgo25 = new Date();
      yearsAgo25.setFullYear(yearsAgo25.getFullYear() - 25);
      yearsAgo25.setDate(yearsAgo25.getDate() - 1);
      expect(
        Calculator.getRetirement({
          borrowers: [{ birthDate: yearsAgo25, gender: GENDER.M }],
        }),
      ).to.equal(40);
    });

    it('returns 0 for a retired person', () => {
      const yearsAgo70 = new Date();
      yearsAgo70.setFullYear(yearsAgo70.getFullYear() - 70);
      yearsAgo70.setDate(yearsAgo70.getDate() - 1);
      expect(
        Calculator.getRetirement({
          borrowers: [{ birthDate: yearsAgo70, gender: GENDER.M }],
        }),
      ).to.equal(0);
    });

    it('Should return 35 with a male of 30 yo', () => {
      const yearsAgo30 = new Date();
      yearsAgo30.setFullYear(yearsAgo30.getFullYear() - 30);
      yearsAgo30.setDate(yearsAgo30.getDate() - 1);
      expect(
        Calculator.getRetirement({
          borrowers: [{ birthDate: yearsAgo30, gender: GENDER.M }],
        }),
      ).to.equal(35);
    });

    it('Should return 34 with a female of 30 yo', () => {
      const yearsAgo30 = new Date();
      yearsAgo30.setFullYear(yearsAgo30.getFullYear() - 30);
      yearsAgo30.setDate(yearsAgo30.getDate() - 1);
      expect(
        Calculator.getRetirement({
          borrowers: [{ birthDate: yearsAgo30, gender: GENDER.F }],
        }),
      ).to.equal(34);
    });

    it('Should return 35 with an undefined gender of 30 yo', () => {
      const yearsAgo30 = new Date();
      yearsAgo30.setFullYear(yearsAgo30.getFullYear() - 30);
      yearsAgo30.setDate(yearsAgo30.getDate() - 1);
      expect(
        Calculator.getRetirement({
          borrowers: [{ birthDate: yearsAgo30 }],
        }),
      ).to.equal(35);
    });

    it('Should return 0 with a female of 64 yo', () => {
      const yearsAgo64 = new Date();
      yearsAgo64.setFullYear(yearsAgo64.getFullYear() - 64);
      yearsAgo64.setDate(yearsAgo64.getDate() - 1);
      expect(
        Calculator.getRetirement({
          borrowers: [{ birthDate: yearsAgo64, gender: GENDER.F }],
        }),
      ).to.equal(0);
    });

    it('Should return 0 with a female over 64 yo', () => {
      const yearsAgo80 = new Date();
      yearsAgo80.setFullYear(yearsAgo80.getFullYear() - 80);
      yearsAgo80.setDate(yearsAgo80.getDate() - 1);
      expect(
        Calculator.getRetirement({
          borrowers: [{ birthDate: yearsAgo80, gender: GENDER.F }],
        }),
      ).to.equal(0);
    });

    it('Should return 10 with a female of 54 yo and male of 54 yo', () => {
      const yearsAgo54 = new Date();
      yearsAgo54.setFullYear(yearsAgo54.getFullYear() - 54);
      yearsAgo54.setDate(yearsAgo54.getDate() - 1);
      expect(
        Calculator.getRetirement({
          borrowers: [
            { birthDate: yearsAgo54, gender: GENDER.F },
            { birthDate: yearsAgo54, gender: GENDER.M },
          ],
        }),
      ).to.equal(10);
    });
  });

  describe('getFortuneReturns', () => {
    it('returns 0 if the ratio is not set', () => {
      expect(
        Calculator.getFortuneReturns({
          borrowers: [{ bankFortune: [{ value: 100 }] }],
        }),
      ).to.equal(0);
    });

    it('returns some revenue if the constant is set', () => {
      const calc = new CalculatorClass({ fortuneReturnsRatio: 0.01 });
      expect(
        calc.getFortuneReturns({
          borrowers: [{ bankFortune: [{ value: 100 }] }],
        }),
      ).to.equal(1);
    });
  });

  describe('getRealEstateExpenses', () => {
    it('adds up expenses for real estate', () => {
      // 12k maintenance, 48k interests, 12k amort
      expect(
        Calculator.getRealEstateExpenses({
          borrowers: [{ realEstate: [{ value: 1200000, loan: 960000 }] }],
        }),
      ).to.equal(6000);
    });

    it('counts no amortization if the loan is below amortizationGoal', () => {
      // 12k maintenance, 39k interests, 0 amort
      expect(
        Calculator.getRealEstateExpenses({
          borrowers: [{ realEstate: [{ value: 1200000, loan: 780000 }] }],
        }),
      ).to.equal(4250);
    });

    it('uses theoreticalExpenses if provided', () => {
      expect(
        Calculator.getRealEstateExpenses({
          borrowers: [
            {
              realEstate: [
                { value: 1200000, loan: 780000, theoreticalExpenses: 120 },
              ],
            },
          ],
        }),
      ).to.equal(10);
    });
  });

  describe('getGroupedExpenses', () => {
    it('groups expenses between borrowers', () => {
      const borrowers = [
        {
          expenses: [
            { description: 'a', value: 10 },
            { description: 'c', value: 1 },
          ],
        },
        {
          expenses: [
            { description: 'b', value: 5 },
            { description: 'a', value: 5 },
          ],
        },
      ];
      expect(Calculator.getGroupedExpenses({ borrowers })).to.deep.equal({
        a: 15,
        b: 5,
        c: 1,
      });
    });

    it('filters expenses without a value', () => {
      const borrowers = [
        {
          expenses: [
            { description: 'a', value: 10 },
            { description: 'c', value: 1 },
          ],
        },
        {
          expenses: [{ description: 'b', value: 5 }, { description: 'a' }],
        },
      ];
      expect(Calculator.getGroupedExpenses({ borrowers })).to.deep.equal({
        a: 10,
        b: 5,
        c: 1,
      });
    });

    it('filters expenses with a falsy value', () => {
      const borrowers = [
        {
          expenses: [
            { description: 'a', value: 10 },
            { description: 'c', value: 1 },
          ],
        },
        {
          expenses: [
            { description: 'b', value: 5 },
            { description: 'a', value: NaN },
            { description: 'a', value: null },
            { description: 'a', value: undefined },
          ],
        },
      ];
      expect(Calculator.getGroupedExpenses({ borrowers })).to.deep.equal({
        a: 10,
        b: 5,
        c: 1,
      });
    });

    it('works with empty arrays', () => {
      const borrowers = [
        {
          expenses: [
            { description: 'a', value: 10 },
            { description: 'c', value: 1 },
          ],
        },
        {
          expenses: [],
        },
      ];
      expect(Calculator.getGroupedExpenses({ borrowers })).to.deep.equal({
        a: 10,
        c: 1,
      });
    });

    it('works with empty objects', () => {
      const borrowers = [
        {
          expenses: [
            { description: 'a', value: 10 },
            { description: 'c', value: 1 },
          ],
        },
        {},
      ];
      expect(Calculator.getGroupedExpenses({ borrowers })).to.deep.equal({
        a: 10,
        c: 1,
      });
    });
  });

  describe('getFormattedExpenses', () => {
    it('gets an object with expenses to add or subtract', () => {
      const calc = new CalculatorClass({
        expensesSubtractFromIncome: [EXPENSES.LEASING],
      });
      const borrowers = [
        {
          expenses: [
            { description: EXPENSES.LEASING, value: 10 },
            { description: EXPENSES.PENSIONS, value: 1 },
          ],
        },
        {
          expenses: [
            { description: EXPENSES.LEASING, value: 5 },
            { description: EXPENSES.OTHER, value: 1 },
          ],
        },
      ];
      expect(calc.getFormattedExpenses({ borrowers })).to.deep.equal({
        add: 2,
        subtract: 15,
      });
    });
  });

  describe('getBorrowerFormHash', () => {
    it('returns a value for a borrower', () => {
      const borrowers = [
        {
          expenses: [
            { description: EXPENSES.LEASING, value: 10 },
            { description: EXPENSES.PENSIONS, value: 1 },
          ],
        },
      ];

      expect(Calculator.getBorrowerFormHash({ borrowers })).to.equal(
        1539864539,
      );
    });

    it('changes for non required form values as well', () => {
      const borrower1 = { company: 'a' };
      const borrower2 = { company: 'b' };

      expect(
        Calculator.getBorrowerFormHash({ borrowers: borrower1 }),
      ).to.not.equal(Calculator.getBorrowerFormHash({ borrowers: borrower2 }));
    });

    it('returns a different value for multiple borrowers', () => {
      const borrowers = [
        {
          expenses: [
            { description: EXPENSES.LEASING, value: 10 },
            { description: EXPENSES.PENSIONS, value: 1 },
          ],
        },
        {
          expenses: [
            { description: EXPENSES.LEASING, value: 5 },
            { description: EXPENSES.OTHER, value: 1 },
          ],
        },
      ];

      expect(Calculator.getBorrowerFormHash({ borrowers })).to.equal(
        5386156423,
      );
    });
  });

  describe('real estate income algorithm', () => {
    it('adds income to - and subtract theoretical cost from - totalIncome for DEFAULT', () => {
      const borrowers = [
        { realEstate: [{ income: 72000, value: 1200000, loan: 960000 }] },
        { realEstate: [{ income: 72000, value: 1200000, loan: 960000 }] },
      ];

      expect(Calculator.getRealEstateIncome({ borrowers })).to.equal(144000);
      expect(Calculator.getTotalIncome({ borrowers })).to.equal(0);
    });

    context('with algoritm POSITIVE_NEGATIVE_SPLIT', () => {
      let calc;

      beforeEach(() => {
        calc = new CalculatorClass({
          realEstateIncomeAlgorithm:
            REAL_ESTATE_INCOME_ALGORITHMS.POSITIVE_NEGATIVE_SPLIT,
        });
      });

      it('adds to income if delta is positive', () => {
        const borrowers = [
          { realEstate: [{ income: 50000, value: 1200000, loan: 960000 }] },
          { realEstate: [{ income: 73000, value: 1200000, loan: 960000 }] },
        ];

        expect(calc.getTotalIncome({ borrowers })).to.equal(1000);
      });

      it('adds to income if delta is positive', () => {
        const borrowers = [
          { realEstate: [{ income: 100000, value: 1200000, loan: 960000 }] },
        ];

        expect(calc.getTotalIncome({ borrowers })).to.equal(28000);
      });

      it('adds to expenses if delta is negative', () => {
        const borrowers = [
          { realEstate: [{ income: 50000, value: 1200000, loan: 960000 }] },
          { realEstate: [{ income: 100000, value: 1200000, loan: 960000 }] },
        ];

        expect(calc.getFormattedExpenses({ borrowers })).to.deep.equal({
          subtract: -28000,
          add: 22000,
        });
      });

      it('considers income based on realEstateIncomeConsideration', () => {
        calc = new CalculatorClass({
          realEstateIncomeAlgorithm:
            REAL_ESTATE_INCOME_ALGORITHMS.POSITIVE_NEGATIVE_SPLIT,
          realEstateIncomeConsideration: 0.8,
        });
        const borrowers = [
          { realEstate: [{ income: 100000, value: 1200000, loan: 960000 }] },
        ];

        expect(calc.getTotalIncome({ borrowers })).to.equal(8000);
      });
    });
  });

  describe('shouldUseNetSalary', () => {
    it('works when applying global rules', () => {
      const loan = {
        structures: [],
        borrowers: [{ salary: 120000, netSalary: 10000 }],
      };
      const calc = new CalculatorClass({
        loan,
        lenderRules: [
          { filter: { and: [true] }, incomeConsiderationType: 'NET' },
          { filter: { and: [{ '>': [{ var: 'INCOME' }, 100000] }] } },
        ],
      });
      const result = calc.shouldUseNetSalary();
      expect(result).to.equal(true);

      const salary = calc.getSalary({ loan });
      expect(salary).to.equal(10000);
    });
  });

  describe('hasInsurancePotential', () => {
    it('returns false if borrower has not uploaded his LPP certificate', () => {
      const borrowers = [{ _id: 'b' }];
      expect(Calculator.hasInsurancePotential({ borrowers }).b).to.deep.include(
        {
          hasPotential: false,
          hasUploadedLppCertificate: false,
        },
      );
    });

    it('returns true if borrower does not have 3A', () => {
      const borrowers = [
        {
          _id: 'b',
          documents: { [DOCUMENTS.PENSION_FUND_YEARLY_STATEMENT]: {} },
          insurance3A: [{ value: 0 }],
        },
      ];
      expect(Calculator.hasInsurancePotential({ borrowers }).b).to.deep.include(
        {
          hasPotential: true,
          hasUploadedLppCertificate: true,
          doesNotHave3A: true,
        },
      );
    });

    it('returns false if borrower has insurance 3A', () => {
      const borrowers = [
        {
          _id: 'b',
          documents: { [DOCUMENTS.PENSION_FUND_YEARLY_STATEMENT]: {} },
          insurance3A: [{ value: 1 }],
        },
      ];
      expect(Calculator.hasInsurancePotential({ borrowers }).b).to.deep.include(
        {
          hasPotential: false,
          hasUploadedLppCertificate: true,
          doesNotHave3A: false,
        },
      );
    });

    it('returns true if borrower does not have 3B in Geneva', () => {
      const borrowers = [
        {
          _id: 'b',
          documents: { [DOCUMENTS.PENSION_FUND_YEARLY_STATEMENT]: {} },
          canton: CANTONS.GE,
          insurance3B: [{ value: 0 }],
        },
      ];
      expect(Calculator.hasInsurancePotential({ borrowers }).b).to.deep.include(
        {
          hasPotential: true,
          hasUploadedLppCertificate: true,
          doesNotHave3BInGenevaOrFribourg: true,
        },
      );
    });

    it('returns false if borrower has 3B in Geneva', () => {
      const borrowers = [
        {
          _id: 'b',
          documents: { [DOCUMENTS.PENSION_FUND_YEARLY_STATEMENT]: {} },
          canton: CANTONS.GE,
          insurance3B: [{ value: 1 }],
          insurance3A: [{ value: 1 }],
        },
      ];

      expect(Calculator.hasInsurancePotential({ borrowers }).b).to.deep.include(
        {
          hasPotential: false,
          hasUploadedLppCertificate: true,
          doesNotHave3BInGenevaOrFribourg: false,
        },
      );
    });

    it('returns true if borrower has bank 3A', () => {
      const borrowers = [
        {
          _id: 'b',
          documents: { [DOCUMENTS.PENSION_FUND_YEARLY_STATEMENT]: {} },
          bank3A: [{ value: 1 }],
        },
      ];

      expect(Calculator.hasInsurancePotential({ borrowers }).b).to.deep.include(
        {
          hasPotential: true,
          hasUploadedLppCertificate: true,
          hasBank3A: true,
        },
      );
    });

    it('returns false if borrower does not have bank 3A', () => {
      const borrowers = [
        {
          _id: 'b',
          documents: { [DOCUMENTS.PENSION_FUND_YEARLY_STATEMENT]: {} },
          insurance3A: [{ value: 1 }],
          bank3A: [{ value: 0 }],
        },
      ];

      expect(Calculator.hasInsurancePotential({ borrowers }).b).to.deep.include(
        {
          hasPotential: false,
          hasUploadedLppCertificate: true,
          hasBank3A: false,
        },
      );
    });

    it('returns true if borrower is self employed', () => {
      const borrowers = [
        {
          _id: 'b',
          documents: { [DOCUMENTS.PENSION_FUND_YEARLY_STATEMENT]: {} },
          insurance3A: [{ value: 1 }],
          activityType: BORROWER_ACTIVITY_TYPES.SELF_EMPLOYED,
        },
      ];

      expect(Calculator.hasInsurancePotential({ borrowers }).b).to.deep.include(
        {
          hasPotential: true,
          hasUploadedLppCertificate: true,
          isSelfEmployed: true,
        },
      );
    });

    it('returns false if borrower is not self employed', () => {
      const borrowers = [
        {
          _id: 'b',
          documents: { [DOCUMENTS.PENSION_FUND_YEARLY_STATEMENT]: {} },
          insurance3A: [{ value: 1 }],
          activityType: BORROWER_ACTIVITY_TYPES.SALARIED,
        },
      ];

      expect(Calculator.hasInsurancePotential({ borrowers }).b).to.deep.include(
        {
          hasPotential: false,
          hasUploadedLppCertificate: true,
          isSelfEmployed: false,
        },
      );
    });

    it('returns true if borrower has own company', () => {
      const borrowers = [
        {
          _id: 'b',
          documents: { [DOCUMENTS.PENSION_FUND_YEARLY_STATEMENT]: {} },
          insurance3A: [{ value: 1 }],
          hasOwnCompany: true,
        },
      ];

      expect(Calculator.hasInsurancePotential({ borrowers }).b).to.deep.include(
        {
          hasPotential: true,
          hasUploadedLppCertificate: true,
          isSelfEmployed: true,
        },
      );
    });

    it('returns false if borrower has no own company', () => {
      const borrowers = [
        {
          _id: 'b',
          documents: { [DOCUMENTS.PENSION_FUND_YEARLY_STATEMENT]: {} },
          insurance3A: [{ value: 1 }],
          hasOwnCompany: false,
        },
      ];

      expect(Calculator.hasInsurancePotential({ borrowers }).b).to.deep.include(
        {
          hasPotential: false,
          hasUploadedLppCertificate: true,
          isSelfEmployed: false,
        },
      );
    });

    it('returns true if borrower is divorced', () => {
      const borrowers = [
        {
          _id: 'b',
          documents: { [DOCUMENTS.PENSION_FUND_YEARLY_STATEMENT]: {} },
          insurance3A: [{ value: 1 }],
          civilStatus: CIVIL_STATUS.DIVORCED,
        },
      ];

      expect(Calculator.hasInsurancePotential({ borrowers }).b).to.deep.include(
        {
          hasPotential: true,
          hasUploadedLppCertificate: true,
          isDivorced: true,
        },
      );
    });

    it('returns false if borrower is not divorced', () => {
      const borrowers = [
        {
          _id: 'b',
          documents: { [DOCUMENTS.PENSION_FUND_YEARLY_STATEMENT]: {} },
          insurance3A: [{ value: 1 }],
          civilStatus: CIVIL_STATUS.MARRIED,
        },
      ];

      expect(Calculator.hasInsurancePotential({ borrowers }).b).to.deep.include(
        {
          hasPotential: false,
          hasUploadedLppCertificate: true,
          isDivorced: false,
        },
      );
    });

    it('returns true if borrower is 50 years old', () => {
      const borrowers = [
        {
          _id: 'b',
          documents: { [DOCUMENTS.PENSION_FUND_YEARLY_STATEMENT]: {} },
          insurance3A: [{ value: 1 }],
          age: 50,
        },
      ];

      expect(Calculator.hasInsurancePotential({ borrowers }).b).to.deep.include(
        {
          hasPotential: true,
          hasUploadedLppCertificate: true,
          isNearRetirement: true,
        },
      );
    });

    it('returns false if borrower is 49 years old', () => {
      const borrowers = [
        {
          _id: 'b',
          documents: { [DOCUMENTS.PENSION_FUND_YEARLY_STATEMENT]: {} },
          insurance3A: [{ value: 1 }],
          age: 49,
        },
      ];

      expect(Calculator.hasInsurancePotential({ borrowers }).b).to.deep.include(
        {
          hasPotential: false,
          hasUploadedLppCertificate: true,
          isNearRetirement: false,
        },
      );
    });

    it('works with 2 borrowers', () => {
      const borrowers = [
        {
          _id: 'b1',
          documents: { [DOCUMENTS.PENSION_FUND_YEARLY_STATEMENT]: {} },
        },
        { _id: 'b2' },
      ];

      expect(Calculator.hasInsurancePotential({ borrowers })).to.deep.include({
        b1: {
          hasUploadedLppCertificate: true,
          doesNotHave3A: true,
          doesNotHave3BInGenevaOrFribourg: false,
          hasBank3A: false,
          isSelfEmployed: false,
          isDivorced: false,
          isNearRetirement: false,
          hasPotential: true,
        },
        b2: {
          hasUploadedLppCertificate: false,
          doesNotHave3A: true,
          doesNotHave3BInGenevaOrFribourg: false,
          hasBank3A: false,
          isSelfEmployed: false,
          isDivorced: false,
          isNearRetirement: false,
          hasPotential: false,
        },
      });
    });
  });
});
