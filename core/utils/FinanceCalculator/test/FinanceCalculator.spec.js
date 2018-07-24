// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import { FinanceCalculator } from '../FinanceCalculator';
import { NO_INTEREST_RATE_ERROR } from '../financeCalculatorConstants';

describe('FinanceCalculator', () => {
  let calc;

  beforeEach(() => {
    calc = new FinanceCalculator();
  });

  describe('getLoanValue', () => {
    it('returns the difference between property and fortune without fees', () => {
      expect(calc.getLoanValue({ propertyValue: 100, fortune: 20 })).to.equal(80);
    });

    it('uses fortune to pay for fees', () => {
      calc = new FinanceCalculator({ notaryFees: 0.05 });
      expect(calc.getLoanValue({ propertyValue: 100, fortune: 25 })).to.equal(80);
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
      expect(calc.getBorrowRatioWithoutLoan({ propertyValue: 100, fortune: 20 })).to.equal(0.8);
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

  describe('getInterests', () => {
    it('aggregates interest rates with loan tranches', () => {
      expect(calc.getInterests({
        tranches: [{ value: 0.5, type: 'a' }, { value: 0.5, type: 'b' }],
        interestRates: { a: 0.01, b: 0.02 },
      })).to.equal(0.5 * 0.01 + 0.5 * 0.02);
    });

    it('returns zero if nothing is provided', () => {
      expect(calc.getInterests()).to.equal(0);
    });

    it('throws if an interest rate is not present', () => {
      expect(() => calc.getInterests({
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
  });
});
