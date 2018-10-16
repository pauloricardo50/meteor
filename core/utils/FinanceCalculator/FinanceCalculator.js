// @flow
import {
  GENDER,
  SUCCESS,
  ERROR,
  WARNING,
  RESIDENCE_TYPE,
} from '../../api/constants';
import {
  NOTARY_FEES,
  AMORTIZATION_STOP,
  DEFAULT_AMORTIZATION,
  MAX_YEARLY_THIRD_PILLAR_PAYMENTS,
  AVERAGE_TAX_RATE,
  MAX_BORROW_RATIO_PRIMARY_PROPERTY,
  MIN_CASH,
  INTERESTS_FINMA,
  MAINTENANCE_FINMA,
  MAX_INCOME_RATIO,
  MAX_INCOME_RATIO_TIGHT,
  MAX_BORROW_RATIO_WITH_PLEDGE,
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
    amortizationBaseRate = DEFAULT_AMORTIZATION,
    amortizationGoal = AMORTIZATION_STOP,
    interestRates = averageRates,
    maxBorrowRatio = MAX_BORROW_RATIO_PRIMARY_PROPERTY,
    maxBorrowRatioWithPledge = MAX_BORROW_RATIO_WITH_PLEDGE,
    maxIncomeRatio = MAX_INCOME_RATIO,
    maxIncomeRatioTight = MAX_INCOME_RATIO_TIGHT,
    minCash = MIN_CASH,
    notaryFees = NOTARY_FEES,
    taxRate = AVERAGE_TAX_RATE,
    theoreticalInterestRate = INTERESTS_FINMA,
    theoreticalMaintenanceRate = MAINTENANCE_FINMA,
    middlewares = [],
    middlewareObject,
  }: {
    amortizationBaseRate?: number,
    amortizationGoal?: number,
    interestRates: Object,
    maxBorrowRatio?: number,
    maxBorrowRatioWithPledge?: number,
    maxIncomeRatio?: number,
    maxIncomeRatioTight?: number,
    minCash?: number,
    notaryFees?: number,
    taxRate?: number,
    theoreticalInterestRate?: number,
    theoreticalMaintenanceRate: number,
    middlewares?: Array<Function>,
    middlewareObject: Object,
  } = {}) {
    this.amortizationBaseRate = amortizationBaseRate;
    this.amortizationGoal = amortizationGoal;
    this.interestRates = interestRates;
    this.maxBorrowRatio = maxBorrowRatio;
    this.maxBorrowRatioWithPledge = maxBorrowRatioWithPledge;
    this.maxIncomeRatio = maxIncomeRatio;
    this.maxIncomeRatioTight = maxIncomeRatioTight;
    this.minCash = minCash;
    this.notaryFees = notaryFees;
    this.taxRate = taxRate;
    this.theoreticalInterestRate = theoreticalInterestRate;
    this.theoreticalMaintenanceRate = theoreticalMaintenanceRate;
    this.setMiddleware(middlewares, middlewareObject);
  }

  setMiddleware = (middlewares?: Array<Function>, middlewareObject) => {
    const middlewareManager = new MiddlewareManager(this, middlewareObject);
    middlewareManager.applyToAllMethods([precisionMiddleware, ...middlewares]);
  };

  getLoanValue({
    propertyValue,
    propertyWork = 0,
    fortune,
    pledgedValue = 0,
    fees = this.getFeesBase({ propertyValue, propertyWork }),
  }: {
    propertyValue: number,
    fortune: number,
    pledgedValue?: number,
    fees?: number,
  }) {
    return propertyValue + propertyWork + fees + pledgedValue - fortune;
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

  getLoanFromBorrowRatio({
    propertyValue,
    borrowRatio,
  }: {
    propertyValue: number,
    borrowRatio: number,
  }) {
    return borrowRatio * propertyValue;
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

  getBorrowRatioStatus({ borrowRatio }) {
    if (borrowRatio <= this.maxBorrowRatio) {
      return SUCCESS;
    }
    if (borrowRatio <= this.maxBorrowRatioWithPledge) {
      return WARNING;
    }
    return ERROR;
  }

  getRetirementForGender({ gender = GENDER.M }: { gender?: string } = {}) {
    return gender === GENDER.F ? 64 : 65;
  }

  getIncomeRatio({
    monthlyIncome,
    monthlyPayment = 0,
  }: {
    monthlyIncome: number,
    monthlyPayment: number,
  }) {
    return monthlyPayment / monthlyIncome;
  }

  getIncomeRatioStatus({ incomeRatio }) {
    if (incomeRatio <= this.maxIncomeRatio) {
      return SUCCESS;
    }
    if (this.maxIncomeRatioTight && incomeRatio <= this.maxIncomeRatioTight) {
      // This ratio can be disabled, i.e. set to 0, and then it'll skip the warning
      // and only display success or error
      return WARNING;
    }
    return ERROR;
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

  getAmortizationRateBase({
    borrowRatio = 0,
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

    return amortizationRate / borrowRatio || 0;
  }

  getMaxLoanBase({
    propertyValue,
    propertyWork,
    pledgedAmount = 0,
    residenceType,
  }: {
    propertyValue: number,
    propertyWork: number,
    pledgedAmount: number,
    residenceType: string,
  } = {}): number {
    if (residenceType === RESIDENCE_TYPE.MAIN_RESIDENCE) {
      return Math.min(
        (propertyValue + propertyWork) * this.maxBorrowRatio + pledgedAmount,
        (propertyValue + propertyWork) * this.maxBorrowRatioWithPledge,
      );
    }
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
    const maintenance = (propAndWork * this.theoreticalMaintenanceRate) / 12;
    const interests = (loanValue * this.theoreticalInterestRate) / 12;
    const amortization = (loanValue * amortizationRate) / 12;
    return this.getLoanCostWithParts({ maintenance, interests, amortization });
  }

  getNotaryFeesRate() {
    return this.notaryFees;
  }

  getMinCash({
    propertyValue,
    propertyWork,
    fees = this.getFeesBase({ propertyValue, propertyWork }),
  }) {
    return (propertyValue + propertyWork) * this.minCash + fees;
  }

  getFeesBase({ fees, propertyValue = 0, propertyWork = 0 }) {
    if (fees === 0 || fees > 0) {
      return fees;
    }

    return (propertyValue + propertyWork) * this.notaryFees;
  }

  getIncomeLimitedPropertyValue = ({ nF, r, i, mR, m }) => ({
    income,
    fortune,
  }) => {
    // The first one is with 0 amortization
    const incomeLimited1 = (mR * income + fortune * i) / (m + (1 + nF) * i);

    // The second is with amortization factored in (and it could be negative due to math)
    const incomeLimited2 = ((1 + r * i) * fortune + mR * r * income)
      / (r * (m + i) + nF * (1 + r * i) + 0.35);

    // Therefore, take the minimum value of both, which is the most limiting one
    // Because of the ratios, round this value down
    return Math.floor(Math.min(incomeLimited1, incomeLimited2));
  };
}

export default new FinanceCalculator();
