// @flow
import { GENDER } from '../../api/constants';
import {
  NOTARY_FEES,
  AMORTIZATION_STOP,
  DEFAULT_AMORTIZATION,
  MAX_YEARLY_THIRD_PILLAR_PAYMENTS,
  AVERAGE_TAX_RATE,
  SECOND_PILLAR_WITHDRAWAL_TAX_RATE,
  MAX_BORROW_RATIO_PRIMARY_PROPERTY,
  MIN_CASH,
  INTERESTS_FINMA,
  MAINTENANCE_FINMA,
} from '../../config/financeConstants';
import { NO_INTEREST_RATE_ERROR } from './financeCalculatorConstants';
import MiddlewareManager from '../MiddlewareManager';
import { precisionMiddleware } from './financeCalculatorMiddlewares';
import { averageRates } from '../../components/InterestRatesTable/interestRates';

export class FinanceCalculator {
  constructor(settings?: Object) {
    this.initFinanceCalculator(settings);
  }

  notaryFees: number;

  amortizationBaseRate: number;

  amortizationGoal: number;

  initFinanceCalculator({
    notaryFees = NOTARY_FEES,
    amortizationBaseRate = DEFAULT_AMORTIZATION,
    amortizationGoal = AMORTIZATION_STOP,
    taxRate = AVERAGE_TAX_RATE,
    secondPillarWithdrawalTaxRate = SECOND_PILLAR_WITHDRAWAL_TAX_RATE,
    maxBorrowRatio = MAX_BORROW_RATIO_PRIMARY_PROPERTY,
    minCash = MIN_CASH,
    interestRates = averageRates,
    theoreticalInterestRate = INTERESTS_FINMA,
    theoreticalMaintenanceRatio = MAINTENANCE_FINMA,
    middlewares = [],
    middlewareObject,
  }: {
    notaryFees?: number,
    amortizationBaseRate?: number,
    amortizationGoal?: number,
    taxRate?: number,
    secondPillarWithdrawalTaxRate?: number,
    maxBorrowRatio?: number,
    minCash?: number,
    interestRates: Object,
    theoreticalInterestRate?: number,
    theoreticalMaintenanceRatio: number,
    middlewares?: Array<Function>,
    middlewareObject: Object,
  } = {}) {
    this.notaryFees = notaryFees;
    this.amortizationBaseRate = amortizationBaseRate;
    this.amortizationGoal = amortizationGoal;
    this.taxRate = taxRate;
    this.secondPillarWithdrawalTaxRate = secondPillarWithdrawalTaxRate;
    this.maxBorrowRatio = maxBorrowRatio;
    this.minCash = minCash;
    this.interestRates = interestRates;
    this.theoreticalInterestRate = theoreticalInterestRate;
    this.theoreticalMaintenanceRatio = theoreticalMaintenanceRatio;
    this.setRoundValuesMiddleware(middlewares, middlewareObject);
  }

  setRoundValuesMiddleware = (
    middlewares?: Array<Function>,
    middlewareObject,
  ) => {
    const middlewareManager = new MiddlewareManager(this, middlewareObject);
    middlewareManager.applyToAllMethods([precisionMiddleware, ...middlewares]);
  };

  getLoanValue({
    propertyValue,
    fortune,
    pledgedValue = 0,
  }: {
    propertyValue: number,
    fortune: number,
  }) {
    return propertyValue * (1 + this.notaryFees) - fortune + pledgedValue;
  }

  getPropAndWork({ propertyValue, propertyWork }) {
    return propertyValue + propertyWork;
  }

  getBorrowRatio({
    propertyValue,
    loan = 0,
  }: {
    propertyValue: number,
    loan: number,
  }) {
    return loan / propertyValue;
  }

  getBorrowRatioWithoutLoan({
    propertyValue,
    fortune,
  }: {
    propertyValue: number,
    fortune: number,
  }) {
    return this.getBorrowRatio({
      propertyValue,
      loan: this.getLoanValue({ propertyValue, fortune }),
    });
  }

  getRetirementForGender({ gender = GENDER.M }: { gender?: string } = {}) {
    return gender === GENDER.F ? 64 : 65;
  }

  getIncomeRatio({ income, payment = 0 }: { income: number, payment: number }) {
    return payment / income;
  }

  getLoanCost({
    maintenance = 0,
    interests = 0,
    amortization = 0,
  }: {
    maintenance?: number,
    interests?: number,
    amortization?: number,
  } = {}) {
    return maintenance + interests + amortization;
  }

  getLoanCostWithParts({
    maintenance,
    interests,
    amortization,
  }: {
    maintenance: number,
    interests: number,
    amortization?: number,
  }) {
    return {
      maintenance,
      interests,
      amortization,
      total: this.getLoanCost({ maintenance, interests, amortization }),
    };
  }

  getInterestsWithTranches({
    tranches = [],
    interestRates = this.interestRates,
  }: {
    tranches: Array<{ type: string, value: number }>,
    interestRates: Object,
  } = {}) {
    return tranches.reduce((acc, { type, value }) => {
      const rate = interestRates[type];

      if (!rate) {
        throw new Error(NO_INTEREST_RATE_ERROR, type);
      }

      return acc + value * rate;
    }, 0);
  }

  getAmortizationRate({
    borrowRatio,
    amortizationYears = 15,
  }: { borrowRatio: number, amortizationRate?: number } = {}) {
    let amortizationRate = 0;
    if (borrowRatio > this.amortizationGoal) {
      // The loan has to be below 65% before 15 years or before retirement,
      // whichever comes first
      const amountToAmortize = borrowRatio - 0.65;

      // Make sure we don't create a black hole, or use negative values by error
      if (amortizationYears > 0) {
        // Amortization is the amount to amortize divided by the amount
        // of years before the deadline
        amortizationRate = amountToAmortize / amortizationYears;
      }
    } else {
      // For projects below 65%, stop amortizing
      // yearlyAmortization = propAndWork * constants.amortization;
    }

    return amortizationRate;
  }

  getAmortizationRateRelativeToLoan({ borrowRatio, amortizationYears }) {
    return (
      this.getAmortizationRate({ borrowRatio, amortizationYears }) / borrowRatio
    );
  }

  getIndirectAmortizationDeduction({
    amortizationRateRelativeToLoan = 0,
    loanValue = 0,
  }: { amortizationRateRelativeToLoan: number, loanValue: 0 } = {}) {
    const yearlyAmortization = amortizationRateRelativeToLoan * loanValue;
    const cappedThirdPillar = Math.min(
      yearlyAmortization,
      MAX_YEARLY_THIRD_PILLAR_PAYMENTS,
    );
    const deduction = this.taxRate * cappedThirdPillar;
    return deduction;
  }

  getSecondPillarWithdrawalTax({
    secondPillarWithdrawal = 0,
  }: { secondPillarWithdrawal: number } = {}) {
    return -secondPillarWithdrawal * this.secondPillarWithdrawalTaxRate;
  }

  getEffectiveLoan({
    loanValue = 0,
    pledgedValue = 0,
  }: { loanValue: number, pledgedValue: number } = {}) {
    return loanValue + pledgedValue;
  }

  getMaxLoan({
    propertyValue,
    propertyWork,
  }: { propertyValue: number, propertyWork: number } = {}) {
    return (propertyValue + propertyWork) * this.maxBorrowRatio;
  }

  getYearsToRetirement = ({
    age1,
    age2,
    gender1,
    gender2,
  }: {
    age1?: number,
    age2?: number,
    gender1?: 'F' | 'M',
    gender2?: 'F' | 'M',
  } = {}) => {
    const retirement1 = this.getRetirementForGender({ gender: gender1 });
    let retirement2 = null;
    if (gender2) {
      retirement2 = this.getRetirementForGender({ gender: gender2 });
    }

    // Substract age to determine remaining time to retirement for both borrowers
    const toRetirement1 = retirement1 - age1;
    let toRetirement2;
    if (retirement2 && age2) {
      toRetirement2 = retirement2 - age2;
    }

    // Get the most limiting time to retirement for both borrowers, in years
    let yearsToRetirement;
    if (toRetirement2) {
      yearsToRetirement = Math.min(toRetirement1, toRetirement2);
    } else {
      yearsToRetirement = toRetirement1;
    }

    return Math.max(yearsToRetirement, 0);
  };

  getTheoreticalMonthly({ propAndWork, loanValue, amortizationRate }) {
    const maintenance = propAndWork * this.theoreticalMaintenanceRatio;
    const interests = loanValue * this.theoreticalInterestRate;
    const amortization = loanValue * amortizationRate;
    return this.getLoanCostWithParts({ maintenance, interests, amortization });
  }
}

export default new FinanceCalculator();
