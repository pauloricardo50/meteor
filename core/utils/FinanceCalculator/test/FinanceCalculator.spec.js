//
/* eslint-env mocha */
import { expect } from 'chai';

import DefaultFinanceCalculator, {
  FinanceCalculator,
} from '../FinanceCalculator';
import { NO_INTEREST_RATE_ERROR } from '../financeCalculatorConstants';
import { RESIDENCE_TYPE } from '../../../api/constants';

describe('FinanceCalculator', () => {
  let calc;

  beforeEach(() => {
    calc = new FinanceCalculator();
  });

  describe('getLoanValue', () => {
    it('returns the difference between property and fortune without fees', () => {
      expect(calc.getLoanValue({ propertyValue: 100, fortune: 20 })).to.equal(
        85,
      );
    });

    it('uses fortune to pay for fees', () => {
      calc = new FinanceCalculator({ notaryFees: 0.1 });
      expect(calc.getLoanValue({ propertyValue: 100, fortune: 30 })).to.equal(
        80,
      );
    });
  });

  describe('getBorrowRatio', () => {
    it('returns a percentage borrowRatio', () => {
      expect(calc.getBorrowRatio({ propertyValue: 100, loan: 80 })).to.equal(
        0.8,
      );
    });

    it('returns zero if no loan is provided', () => {
      expect(calc.getBorrowRatio({ propertyValue: 100 })).to.equal(0);
    });
  });

  describe('getBorrowRatioWithoutLoan', () => {
    it('returns a percentage borrowRatio', () => {
      expect(
        calc.getBorrowRatioWithoutLoan({ propertyValue: 100, fortune: 25 }),
      ).to.equal(0.8);
    });
  });

  describe('getRetirementForGender', () => {
    it('returns a different value for male and female', () => {
      expect(calc.getRetirementForGender({ gender: 'M' })).to.not.equal(
        undefined,
      );
      expect(calc.getRetirementForGender({ gender: 'M' })).to.not.equal(
        undefined,
      );
      expect(calc.getRetirementForGender({ gender: 'M' })).to.not.equal(
        calc.getRetirementForGender({ gender: 'F' }),
      );
    });

    it('returns male retirement if nothing is provided', () => {
      expect(calc.getRetirementForGender({})).to.equal(65);
      expect(calc.getRetirementForGender()).to.equal(65);
    });
  });

  describe('getIncomeRatio', () => {
    it('returns the ratio between payment and income', () => {
      expect(
        calc.getIncomeRatio({ monthlyIncome: 1, monthlyPayment: 0.5 }),
      ).to.equal(0.5);
    });

    it('returns zero if no payment is provided', () => {
      expect(
        calc.getIncomeRatio({ monthlyIncome: 1, monthlyPayment: 0 }),
      ).to.equal(0);
    });
  });

  describe('getLoanCost', () => {
    it('returns the sum of the 3 components', () => {
      expect(
        calc.getLoanCost({ maintenance: 1, interests: 2, amortization: 3 }),
      ).to.equal(6);
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
      expect(
        calc.getInterestsWithTranches({
          tranches: [
            { value: 0.5, type: 'a' },
            { value: 0.5, type: 'b' },
          ],
          interestRates: { a: 0.01, b: 0.02 },
        }),
      ).to.equal(0.5 * 0.01 + 0.5 * 0.02);
    });

    it('returns zero if nothing is provided', () => {
      expect(calc.getInterestsWithTranches()).to.equal(0);
    });

    it('return a dash if an interest rate is not present', () => {
      expect(
        calc.getInterestsWithTranches({
          tranches: [{ value: 0.5, type: 'a' }],
          interestRates: { b: 0.02 },
        }),
      ).to.equal('-');
    });
  });

  describe('getAmortizationRateBase', () => {
    it('returns the amortization base rate for an 80% loan with proper precision', () => {
      calc = new FinanceCalculator({
        amortizationBaseRate: 0.01,
        amortizationGoal: 0.65,
      });
      expect(calc.getAmortizationRateBase({ borrowRatio: 0.8 })).to.equal(
        0.0125,
      );
    });

    it('returns zero if already below the amortizationGoal', () => {
      calc = new FinanceCalculator({
        amortizationBaseRate: 0.01,
        amortizationGoal: 0.65,
      });
      expect(calc.getAmortizationRateBase({ borrowRatio: 0.64 })).to.equal(0);
    });

    it('returns zero if already exactly at the amortizationGoal', () => {
      calc = new FinanceCalculator({
        amortizationBaseRate: 0.01,
        amortizationGoal: 0.65,
      });
      expect(calc.getAmortizationRateBase({ borrowRatio: 0.65 })).to.equal(0);
    });

    it('returns zero if nothing is provided', () => {
      calc = new FinanceCalculator({
        amortizationBaseRate: 0.01,
        amortizationGoal: 0.65,
      });
      expect(calc.getAmortizationRateBase()).to.equal(0);
      expect(calc.getAmortizationRateBase({})).to.equal(0);
    });
  });

  describe('DefaultFinanceCalculator', () => {
    beforeEach(() => {
      calc = DefaultFinanceCalculator;
    });

    it('has default initialization settings', () => {
      expect(calc.getLoanValue({ propertyValue: 100, fortune: 25 })).to.equal(
        80,
      );
      expect(calc.getAmortizationRateBase({ borrowRatio: 0.8 })).to.equal(
        0.0125,
      );
    });
  });

  describe('Calculate Years to Retirement', () => {
    it('Should return 35 with a male of 30 yo', () => {
      expect(calc.getYearsToRetirement({ age1: 30, gender1: 'M' })).to.equal(
        35,
      );
    });

    it('Should return 34 with a female of 30 yo', () => {
      expect(calc.getYearsToRetirement({ age1: 30, gender1: 'F' })).to.equal(
        34,
      );
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
      expect(
        calc.getYearsToRetirement({
          age1: 54,
          age2: 54,
          gender1: 'F',
          gender2: 'M',
        }),
      ).to.equal(10);
    });
  });

  describe('getFeesBase', () => {
    it('returns fees if its above 0 or 0', () => {
      expect(calc.getFeesBase({ fees: 0 })).to.equal(0);
      expect(calc.getFeesBase({ fees: 123 })).to.equal(123);
    });

    it('returns 0 if nothing is passed', () => {
      expect(calc.getFeesBase({})).to.equal(0);
    });

    it('returns calculated fees if no fees are provided', () => {
      expect(calc.getFeesBase({ propertyValue: 100 })).to.equal(5);
      expect(calc.getFeesBase({ propertyValue: 0 })).to.equal(0);
    });
  });

  describe('getTheoreticalMonthly', () => {
    it('returns a correct value', () => {
      const expected = {
        maintenance: 1000,
        interests: 4000,
        amortization: 1000,
        total: 6000,
      };

      expect(
        calc.getTheoreticalMonthly({
          propAndWork: 1200000,
          loanValue: 960000,
          amortizationRate: calc.getAmortizationRateBase({ borrowRatio: 0.8 }),
        }),
      ).to.deep.equal(expected);
    });
  });

  describe('getMaxLoanBase', () => {
    it('returns 80% of the property by default', () => {
      expect(
        calc.getMaxLoanBase({
          propertyValue: 90,
          propertyWork: 10,
          pledgedAmount: 1000,
        }),
      ).to.equal(80);
    });

    it('returns 80% of the property for a main residence if nothing is pledged', () => {
      expect(
        calc.getMaxLoanBase({
          propertyValue: 90,
          propertyWork: 10,
          residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
        }),
      ).to.equal(80);
    });

    it('returns between 80 and 90% of the property for a main residence if a little is pledged', () => {
      expect(
        calc.getMaxLoanBase({
          propertyValue: 90,
          propertyWork: 10,
          residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
          pledgedAmount: 5,
        }),
      ).to.equal(85);
    });

    it('caps at 90% of the property', () => {
      expect(
        calc.getMaxLoanBase({
          propertyValue: 90,
          propertyWork: 10,
          residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
          pledgedAmount: 20,
        }),
      ).to.equal(90);
    });

    it('allows any percent if specified', () => {
      expect(
        calc.getMaxLoanBase({
          propertyValue: 100,
          maxBorrowRatio: 0.95,
        }),
      ).to.equal(95);
    });
  });

  describe('getAveragedInterestRate', () => {
    it('returns the same value if only one rate at 100%', () => {
      expect(
        calc.getAveragedInterestRate({
          tranches: [{ type: 'rateType', value: 1 }],
          interestRates: { rateType: 0.01 },
        }),
      ).to.equal(0.01);
    });

    it('averages 2 rates out', () => {
      expect(
        calc.getAveragedInterestRate({
          tranches: [
            { type: 'rateType1', value: 0.5 },
            { type: 'rateType2', value: 0.5 },
          ],
          interestRates: { rateType1: 0.01, rateType2: 0.02 },
        }),
      ).to.equal(0.015);
    });
  });
});
