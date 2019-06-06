// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import Calculator, { Calculator as CalculatorClass } from '..';
import { OWN_FUNDS_USAGE_TYPES } from 'core/api/constants';
import {
  OWN_FUNDS_TYPES,
  RESIDENCE_TYPE,
  DEFAULT_SECONDARY_RESIDENCE_RULES,
  INCOME_CONSIDERATION_TYPES,
} from '../../../api/constants';

describe('SolvencyCalculator', () => {
  describe('suggestStructure', () => {
    let loan;
    let borrower;

    beforeEach(() => {
      borrower = { _id: 'borrowerId' };
      loan = { borrowers: [borrower] };
    });

    it('suggests a structure with all bankFortune if possible', () => {
      borrower.bankFortune = 500000;
      expect(Calculator.suggestStructure({ loan, propertyValue: 1000000 })).to.deep.equal([
        {
          type: OWN_FUNDS_TYPES.BANK_FORTUNE,
          value: 250000,
          borrowerId: 'borrowerId',
        },
      ]);
    });

    it('calculates exact notary fees if the canton is set', () => {
      borrower.bankFortune = 500000;
      expect(Calculator.suggestStructure({
        loan,
        propertyValue: 1000008,
        canton: 'GE',
      })).to.deep.equal([
        {
          type: OWN_FUNDS_TYPES.BANK_FORTUNE,
          value: 255162,
          borrowerId: 'borrowerId',
        },
      ]);
    });

    it('suggests a structure with multiple ownFunds', () => {
      borrower.bankFortune = 200000;
      borrower.insurance3B = [{ value: 100000 }];
      expect(Calculator.suggestStructure({ loan, propertyValue: 1000000 })).to.deep.equal([
        {
          type: OWN_FUNDS_TYPES.BANK_FORTUNE,
          value: 200000,
          borrowerId: 'borrowerId',
        },
        {
          type: OWN_FUNDS_TYPES.INSURANCE_3B,
          value: 50000,
          borrowerId: 'borrowerId',
          usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW,
        },
      ]);
    });

    it('does not use 2nd pillar if not a main residence', () => {
      borrower.bankFortune = 200000;
      borrower.insurance2 = [{ value: 100000 }];
      expect(Calculator.suggestStructure({ loan, propertyValue: 1000000 })).to.deep.equal([
        {
          type: OWN_FUNDS_TYPES.BANK_FORTUNE,
          value: 200000,
          borrowerId: 'borrowerId',
        },
      ]);
    });

    it('uses 2nd pillar if not a main residence', () => {
      borrower.bankFortune = 200000;
      borrower.insurance2 = [{ value: 100000 }];
      expect(Calculator.suggestStructure({
        loan,
        propertyValue: 1000000,
        residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
      })).to.deep.equal([
        {
          type: OWN_FUNDS_TYPES.BANK_FORTUNE,
          value: 200000,
          borrowerId: 'borrowerId',
        },
        {
          type: OWN_FUNDS_TYPES.INSURANCE_2,
          value: 50000,
          borrowerId: 'borrowerId',
          usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW,
        },
      ]);
    });

    it('always gets up to the exact value', () => {
      const loanValue = 800000;
      loan.structure = {
        wantedLoan: loanValue,
        property: { totalValue: 1000000, canton: 'GE' },
        propertyWork: 100000,
      };
      loan.residenceType = RESIDENCE_TYPE.MAIN_RESIDENCE;
      const required = Calculator.getRequiredOwnFunds({ loan });
      borrower.bankFortune = 200000;
      borrower.insurance2 = [{ value: 150000 }];
      const ownFunds = Calculator.suggestStructure({
        loan,
        propertyValue: 1100000,
        residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
        loanValue,
        canton: 'GE',
        notaryFees: 32104.1,
      });
      const total = ownFunds.reduce((t, { value }) => t + value, 0);

      expect(total).to.equal(Math.round(required));
    });
  });

  describe('getMaxPropertyValue', () => {
    it('recommends a standard value with unlimited income', () => {
      expect(Calculator.getMaxPropertyValue({
        borrowers: [{ bankFortune: 500000, salary: 1000000 }],
      })).to.equal(2000000);
    });

    it('recommends a standard value with unlimited income', () => {
      expect(Calculator.getMaxPropertyValue({
        borrowers: [{ bankFortune: 455000, salary: 1000000 }],
      })).to.equal(1820000);
    });

    it('returns 0 with no income', () => {
      expect(Calculator.getMaxPropertyValue({
        borrowers: [{ bankFortune: 500000, salary: 0 }],
      })).to.equal(0);
    });

    it('returns 0 with no fortune', () => {
      expect(Calculator.getMaxPropertyValue({
        borrowers: [{ bankFortune: 0, salary: 1000000 }],
      })).to.equal(0);
    });

    it('recommends a standard value with unlimited own Funds', () => {
      expect(Calculator.getMaxPropertyValue({
        borrowers: [{ bankFortune: 500000, salary: 180000 }],
      })).to.equal(1000000);
    });
  });

  describe('suggestStructureForLoan', () => {
    it('suggests a structure including for property work', () => {
      expect(Calculator.suggestStructureForLoan({
        loan: {
          borrowers: [
            { bankFortune: 500000, salary: 180000, _id: 'borrower1' },
          ],
          structures: [
            { id: 'struct1', propertyValue: 900000, propertyWork: 100000 },
          ],
        },
        structureId: 'struct1',
      })).to.deep.equal([
        { type: 'bankFortune', value: 245000, borrowerId: 'borrower1' },
      ]);
    });
  });

  describe('getMaxPropertyValueWithoutBorrowRatio', () => {
    it('finds the ideal borrowRatio', () => {
      const {
        borrowRatio,
        propertyValue,
      } = Calculator.getMaxPropertyValueWithoutBorrowRatio({
        borrowers: [{ bankFortune: 500000, salary: 1000000 }],
      });
      expect(borrowRatio).to.equal(0.8);
      expect(propertyValue).to.equal(2000000);
    });

    it('finds the ideal borrowRatio', () => {
      const {
        borrowRatio,
        propertyValue,
      } = Calculator.getMaxPropertyValueWithoutBorrowRatio({
        borrowers: [{ bankFortune: 250000, salary: 100000 }],
      });
      expect(borrowRatio).to.equal(0.6938);
      expect(propertyValue).to.equal(700000);
    });

    it('finds the ideal borrowRatio', () => {
      const {
        borrowRatio,
        propertyValue,
      } = Calculator.getMaxPropertyValueWithoutBorrowRatio({
        borrowers: [{ bankFortune: 250000, salary: 50000 }],
      });
      expect(borrowRatio).to.equal(0.515);
      expect(propertyValue).to.equal(466000);
    });

    it('finds the ideal borrowRatio', () => {
      const {
        borrowRatio,
        propertyValue,
      } = Calculator.getMaxPropertyValueWithoutBorrowRatio({
        borrowers: [{ bankFortune: 200000, salary: 83000 }],
      });
      expect(borrowRatio).to.equal(0.7);
      expect(propertyValue).to.equal(571000);
    });

    it('finds the ideal borrowRatio for main residence type with insurance2', () => {
      const {
        borrowRatio,
        propertyValue,
      } = Calculator.getMaxPropertyValueWithoutBorrowRatio({
        borrowers: [
          {
            bankFortune: 500000,
            salary: 1000000,
            insurance2: [{ value: 100000 }],
          },
        ],
        residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
      });
      expect(borrowRatio).to.equal(0.8);
      expect(propertyValue).to.equal(2400000);
    });

    it('finds the ideal borrowRatio for second residence type with insurance2', () => {
      const {
        borrowRatio,
        propertyValue,
      } = Calculator.getMaxPropertyValueWithoutBorrowRatio({
        borrowers: [
          {
            bankFortune: 230000,
            salary: 120000,
          },
        ],
        residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
        canton: 'GE',
      });
      expect(borrowRatio).to.equal(0.7313);
      expect(propertyValue).to.equal(769000);
    });

    it('should not exceed max borrow ratio of a lender', () => {
      const lenderRules = [
        {
          order: 0,
          maxBorrowRatio: 0.9,
          bonusConsideration: 0.7,
          expensesSubtractFromIncome: [],
          theoreticalInterestRate: 0.045,
          theoreticalMaintenanceRate: 0.007,
          maxIncomeRatio: 0.38,
          filter: { and: [true] },
          incomeConsiderationType: INCOME_CONSIDERATION_TYPES.NET,
        },
        {
          order: 1,
          maxBorrowRatio: 0.7,
          filter: { and: DEFAULT_SECONDARY_RESIDENCE_RULES },
          amortizationGoal: 0.5,
          amortizationYears: 12,
        },
      ];

      const borrowers = [
        {
          bankFortune: 130000,
          insurance2: [{ value: 100000 }],
          netSalary: 125000,
          salary: 182000,
          bonusExists: true,
          bonus2015: 50000,
          bonus2016: 50000,
          bonus2017: 50000,
          bonus2018: 50000,
        },
      ];
      const loanObject = Calculator.createLoanObject({
        residenceType: RESIDENCE_TYPE.SECOND_RESIDENCE,
        borrowers,
        canton: 'GE',
      });

      const calc = new CalculatorClass({ lenderRules, loan: loanObject });
      const results = calc.getMaxPropertyValueWithoutBorrowRatio({
        borrowers,
        canton: 'GE',
        residenceType: RESIDENCE_TYPE.SECOND_RESIDENCE,
      });

      expect(results.borrowRatio).to.equal(0.7);
      expect(results.propertyValue).to.equal(362000);
    });

    it('should work with a very small borrowRatio', () => {
      const lenderRules = [
        {
          order: 0,
          maxBorrowRatio: 0.5,
          bonusConsideration: 0.7,
          expensesSubtractFromIncome: [],
          theoreticalInterestRate: 0.045,
          theoreticalMaintenanceRate: 0.007,
          maxIncomeRatio: 0.38,
          filter: { and: [true] },
          incomeConsiderationType: INCOME_CONSIDERATION_TYPES.NET,
        },
      ];

      const borrowers = [
        {
          bankFortune: 130000,
          insurance2: [{ value: 100000 }],
          netSalary: 125000,
          salary: 182000,
          bonusExists: true,
          bonus2015: 50000,
          bonus2016: 50000,
          bonus2017: 50000,
          bonus2018: 50000,
        },
      ];
      const loanObject = Calculator.createLoanObject({
        residenceType: RESIDENCE_TYPE.SECOND_RESIDENCE,
        borrowers,
        canton: 'GE',
      });

      const calc = new CalculatorClass({ lenderRules, loan: loanObject });
      const results = calc.getMaxPropertyValueWithoutBorrowRatio({
        borrowers,
        canton: 'GE',
        residenceType: RESIDENCE_TYPE.SECOND_RESIDENCE,
      });

      expect(results.borrowRatio).to.equal(0.5);
      expect(results.propertyValue).to.equal(232000);
    });
  });
});
