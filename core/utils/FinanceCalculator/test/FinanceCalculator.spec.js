// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import { MAX_YEARLY_THIRD_PILLAR_PAYMENTS } from '../../../config/financeConstants';
import DefaultFinanceCalculator, {
  FinanceCalculator,
} from '../FinanceCalculator';
import { NO_INTEREST_RATE_ERROR } from '../financeCalculatorConstants';

describe('FinanceCalculator', () => {
  let calc;

  beforeEach(() => {
    calc = new FinanceCalculator();
  });

  describe('getLoanValue', () => {
    it('returns the difference between property and fortune without fees', () => {
      expect(calc.getLoanValue({ propertyValue: 100, fortune: 20 })).to.equal(85);
    });

    it('uses fortune to pay for fees', () => {
      calc = new FinanceCalculator({ notaryFees: 0.1 });
      expect(calc.getLoanValue({ propertyValue: 100, fortune: 30 })).to.equal(80);
    });
  });

  describe('getBorrowRatio', () => {
    it('returns a percentage borrowRatio', () => {
      expect(calc.getBorrowRatio({ propertyValue: 100, loan: 80 })).to.equal(0.8);
    });

    it('returns zero if no loan is provided', () => {
      expect(calc.getBorrowRatio({ propertyValue: 100 })).to.equal(0);
    });
  });

  describe('getBorrowRatioWithoutLoan', () => {
    it('returns a percentage borrowRatio', () => {
      expect(calc.getBorrowRatioWithoutLoan({ propertyValue: 100, fortune: 25 })).to.equal(0.8);
    });
  });

  describe('getRetirementForGender', () => {
    it('returns a different value for male and female', () => {
      expect(calc.getRetirementForGender({ gender: 'M' })).to.not.equal(undefined);
      expect(calc.getRetirementForGender({ gender: 'M' })).to.not.equal(undefined);
      expect(calc.getRetirementForGender({ gender: 'M' })).to.not.equal(calc.getRetirementForGender({ gender: 'F' }));
    });

    it('returns male retirement if nothing is provided', () => {
      expect(calc.getRetirementForGender({})).to.equal(65);
      expect(calc.getRetirementForGender()).to.equal(65);
    });
  });

  describe('getIncomeRatio', () => {
    it('returns the ratio between payment and income', () => {
      expect(calc.getIncomeRatio({ income: 1, payment: 0.5 })).to.equal(0.5);
    });

    it('returns zero if no payment is provided', () => {
      expect(calc.getIncomeRatio({ income: 1, payment: 0 })).to.equal(0);
    });
  });

  describe('getLoanCost', () => {
    it('returns the sum of the 3 components', () => {
      expect(calc.getLoanCost({ maintenance: 1, interests: 2, amortization: 3 })).to.equal(6);
    });

    it('ignores a value if not provided', () => {
      expect(calc.getLoanCost({ interests: 2, amortization: 3 })).to.equal(5);
      expect(calc.getLoanCost({ maintenance: 1, amortization: 3 })).to.equal(4);
      expect(calc.getLoanCost({ maintenance: 1, interests: 2 })).to.equal(3);
    });

    it('returns zero if nothing is provided', () => {
      expect(calc.getLoanCost()).to.equal(0);
    });
  });

  describe('getInterestsWithTranches', () => {
    it('aggregates interest rates with loan tranches', () => {
      expect(calc.getInterestsWithTranches({
        tranches: [{ value: 0.5, type: 'a' }, { value: 0.5, type: 'b' }],
        interestRates: { a: 0.01, b: 0.02 },
      })).to.equal(0.5 * 0.01 + 0.5 * 0.02);
    });

    it('returns zero if nothing is provided', () => {
      expect(calc.getInterestsWithTranches()).to.equal(0);
    });

    it('throws if an interest rate is not present', () => {
      expect(() =>
        calc.getInterestsWithTranches({
          tranches: [{ value: 0.5, type: 'a' }],
          interestRates: { b: 0.02 },
        })).to.throw(NO_INTEREST_RATE_ERROR);
    });
  });

  describe('getAmortizationRate', () => {
    it('returns the amortization base rate for an 80% loan with proper precision', () => {
      calc = new FinanceCalculator({
        amortizationBaseRate: 0.01,
        amortizationGoal: 0.65,
      });
      expect(calc.getAmortizationRate({ borrowRatio: 0.8 })).to.equal(0.01);
    });

    it('returns zero if already below the amortizationGoal', () => {
      calc = new FinanceCalculator({
        amortizationBaseRate: 0.01,
        amortizationGoal: 0.65,
      });
      expect(calc.getAmortizationRate({ borrowRatio: 0.64 })).to.equal(0);
    });

    it('returns zero if already exactly at the amortizationGoal', () => {
      calc = new FinanceCalculator({
        amortizationBaseRate: 0.01,
        amortizationGoal: 0.65,
      });
      expect(calc.getAmortizationRate({ borrowRatio: 0.65 })).to.equal(0);
    });

    it('returns zero if nothing is provided', () => {
      calc = new FinanceCalculator({
        amortizationBaseRate: 0.01,
        amortizationGoal: 0.65,
      });
      expect(calc.getAmortizationRate()).to.equal(0);
      expect(calc.getAmortizationRate({})).to.equal(0);
    });
  });

  describe('getAmortizationRateRelativeToLoan', () => {
    it('returns amortization, but relative to the borrowRatio', () => {
      calc = new FinanceCalculator({
        amortizationBaseRate: 0.01,
        amortizationGoal: 0.65,
      });
      expect(calc.getAmortizationRateRelativeToLoan({ borrowRatio: 0.8 })).to.equal(0.0125);
    });
  });

  describe('DefaultFinanceCalculator', () => {
    beforeEach(() => {
      calc = DefaultFinanceCalculator;
    });

    it('has default initialization settings', () => {
      expect(calc.getLoanValue({ propertyValue: 100, fortune: 25 })).to.equal(80);
      expect(calc.getAmortizationRate({ borrowRatio: 0.8 })).to.equal(0.01);
      expect(calc.getAmortizationRateRelativeToLoan({ borrowRatio: 0.8 })).to.equal(0.0125);
    });
  });

  describe('getIndirectAmortizationDeduction', () => {
    it('returns zero if nothing is provided', () => {
      expect(calc.getIndirectAmortizationDeduction()).to.equal(0);
    });

    it('returns zero if the loan is zero', () => {
      expect(calc.getIndirectAmortizationDeduction({
        loanValue: 0,
        amortizationRateRelativeToLoan: 2,
      })).to.equal(0);
      expect(calc.getIndirectAmortizationDeduction({
        amortizationRateRelativeToLoan: 2,
      })).to.equal(0);
    });

    it('returns zero if the rate is zero', () => {
      expect(calc.getIndirectAmortizationDeduction({
        loanValue: 2,
        amortizationRateRelativeToLoan: 0,
      })).to.equal(0);
      expect(calc.getIndirectAmortizationDeduction({
        loanValue: 2,
      })).to.equal(0);
    });

    it('caps deduction at the swiss national level', () => {
      expect(calc.getIndirectAmortizationDeduction({
        loanValue: 1000000,
        amortizationRateRelativeToLoan: 0.01,
      })).to.equal(calc.getIndirectAmortizationDeduction({
        loanValue: 2000000,
        amortizationRateRelativeToLoan: 0.01,
      }));
    });

    it('uses the taxRate to calculate deduction', () => {
      const taxRate = 0.5;
      calc = new FinanceCalculator({ taxRate });
      const rate = calc.getAmortizationRateRelativeToLoan({ borrowRatio: 0.8 });
      expect(calc.getIndirectAmortizationDeduction({
        loanValue: 800000,
        amortizationRateRelativeToLoan: rate,
      })).to.equal(MAX_YEARLY_THIRD_PILLAR_PAYMENTS * taxRate);
    });

    it('deduces less if there is less to amortize', () => {
      expect(calc.getIndirectAmortizationDeduction({
        loanValue: 250000,
        amortizationRateRelativeToLoan: 0.01,
      })).to.equal(625);
    });
  });

  describe('getSecondPillarWithdrawalTax', () => {
    it('returns zero if nothing is provided', () => {
      expect(calc.getSecondPillarWithdrawalTax()).to.equal(0);
      expect(calc.getSecondPillarWithdrawalTax({})).to.equal(0);
    });

    it('multiplies by the withdrawal tax', () => {
      expect(calc.getSecondPillarWithdrawalTax({ secondPillarWithdrawal: 100 })).to.equal(-10);
    });
  });

  describe('Calculate Years to Retirement', () => {
    it('Should return 35 with a male of 30 yo', () => {
      expect(calc.getYearsToRetirement({ age1: 30, gender1: 'M' })).to.equal(35);
    });

    it('Should return 34 with a female of 30 yo', () => {
      expect(calc.getYearsToRetirement({ age1: 30, gender1: 'F' })).to.equal(34);
    });

    it('Should return 35 with an undefined gender of 30 yo', () => {
      expect(calc.getYearsToRetirement({ age1: 30 })).to.equal(35);
    });

    it('Should return 0 with a female of 64 yo', () => {
      expect(calc.getYearsToRetirement({ age1: 64, gender1: 'F' })).to.equal(0);
    });

    it('Should return 0 with a female over 64 yo', () => {
      expect(calc.getYearsToRetirement({ age1: 80, gender1: 'F' })).to.equal(0);
    });

    it('Should return 10 with a female of 54 yo and male of 54 yo', () => {
      expect(calc.getYearsToRetirement({
        age1: 54,
        age2: 54,
        gender1: 'F',
        gender2: 'M',
      })).to.equal(10);
    });
  });
});
