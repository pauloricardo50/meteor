// @flow
import {
  GENDER,
  SUCCESS,
  ERROR,
  WARNING,
  RESIDENCE_TYPE,
  REAL_ESTATE_CONSIDERATION_TYPES,
  EXPENSE_TYPES_WITHOUT_DELTAS,
} from '../../api/constants';
import {
  AMORTIZATION_STOP,
  AMORTIZATION_YEARS,
  AVERAGE_TAX_RATE,
  BONUS_ALGORITHMS,
  BONUS_CONSIDERATION,
  BONUS_HISTORY_TO_CONSIDER,
  COMPANY_INCOME_TO_CONSIDER,
  DEFAULT_AMORTIZATION,
  DIVIDENDS_CONSIDERATION,
  DIVIDENDS_HISTORY_TO_CONSIDER,
  ESTIMATED_COMMISSION,
  FORTUNE_RETURNS_RATIO,
  INTERESTS_FINMA,
  INVESTMENT_INCOME_CONSIDERATION,
  MAINTENANCE_FINMA,
  MAX_BORROW_RATIO_PRIMARY_PROPERTY,
  MAX_BORROW_RATIO_WITH_PLEDGE,
  MAX_INCOME_RATIO_TIGHT,
  MAX_INCOME_RATIO,
  MIN_CASH,
  NOTARY_FEES,
  OWN_FUNDS_ROUNDING_AMOUNT,
  PENSION_INCOME_CONSIDERATION,
  REAL_ESTATE_INCOME_ALGORITHMS,
  REAL_ESTATE_INCOME_CONSIDERATION,
  REFERRAL_COMMISSION_SPLIT,
  REFERRAL_COMMISSION,
} from '../../config/financeConstants';
import MiddlewareManager from '../MiddlewareManager';
import { precisionMiddleware } from './financeCalculatorMiddlewares';
import { memoizeMiddleware } from '../Calculator/middleware';

export class FinanceCalculator {
  constructor(settings?: Object) {
    this.initFinanceCalculator(settings);
  }

  notaryFees: number;

  amortizationBaseRate: number;

  amortizationGoal: number;

  initFinanceCalculator({
    allowPledge = true,
    amortizationBaseRate = DEFAULT_AMORTIZATION,
    amortizationGoal = AMORTIZATION_STOP,
    amortizationYears = AMORTIZATION_YEARS,
    bonusAlgorithm = BONUS_ALGORITHMS.WEAK_AVERAGE,
    bonusConsideration = BONUS_CONSIDERATION,
    bonusHistoryToConsider = BONUS_HISTORY_TO_CONSIDER,
    companyIncomeHistoryToConsider = COMPANY_INCOME_TO_CONSIDER,
    dividendsConsideration = DIVIDENDS_CONSIDERATION,
    dividendsHistoryToConsider = DIVIDENDS_HISTORY_TO_CONSIDER,
    expensesSubtractFromIncome = EXPENSE_TYPES_WITHOUT_DELTAS,
    fortuneReturnsRatio = FORTUNE_RETURNS_RATIO,
    investmentIncomeConsideration = INVESTMENT_INCOME_CONSIDERATION,
    maxBorrowRatio = MAX_BORROW_RATIO_PRIMARY_PROPERTY,
    maxBorrowRatioWithPledge = MAX_BORROW_RATIO_WITH_PLEDGE,
    maxIncomeRatio = MAX_INCOME_RATIO,
    maxIncomeRatioTight = MAX_INCOME_RATIO_TIGHT,
    minCash = MIN_CASH,
    notaryFees = NOTARY_FEES,
    ownFundsRoundingAmount = OWN_FUNDS_ROUNDING_AMOUNT,
    pensionIncomeConsideration = PENSION_INCOME_CONSIDERATION,
    realEstateIncomeAlgorithm = REAL_ESTATE_INCOME_ALGORITHMS.DEFAULT,
    realEstateIncomeConsideration = REAL_ESTATE_INCOME_CONSIDERATION,
    realEstateIncomeConsiderationType = REAL_ESTATE_CONSIDERATION_TYPES.ADD_TO_INCOME,
    taxRate = AVERAGE_TAX_RATE,
    theoreticalInterestRate = INTERESTS_FINMA,
    theoreticalInterestRate2ndRank = null,
    theoreticalMaintenanceRate = MAINTENANCE_FINMA,
    estimatedCommission = ESTIMATED_COMMISSION,
    referralCommission = REFERRAL_COMMISSION,
    referralCommissionSplit = REFERRAL_COMMISSION_SPLIT,
    middlewares = [],
    middlewareObject,
  } = {}) {
    this.allowPledge = allowPledge;
    this.amortizationBaseRate = amortizationBaseRate;
    this.amortizationGoal = amortizationGoal;
    this.amortizationYears = amortizationYears;
    this.bonusAlgorithm = bonusAlgorithm;
    this.bonusConsideration = bonusConsideration;
    this.bonusHistoryToConsider = bonusHistoryToConsider;
    this.companyIncomeHistoryToConsider = companyIncomeHistoryToConsider;
    this.dividendsConsideration = dividendsConsideration;
    this.dividendsHistoryToConsider = dividendsHistoryToConsider;
    this.expensesSubtractFromIncome = expensesSubtractFromIncome;
    this.fortuneReturnsRatio = fortuneReturnsRatio;
    this.investmentIncomeConsideration = investmentIncomeConsideration;
    this.maxBorrowRatio = maxBorrowRatio;
    this.maxBorrowRatioWithPledge = maxBorrowRatioWithPledge;
    this.maxIncomeRatio = maxIncomeRatio;
    this.maxIncomeRatioTight = maxIncomeRatioTight;
    this.minCash = minCash;
    this.notaryFees = notaryFees;
    this.ownFundsRoundingAmount = ownFundsRoundingAmount;
    this.pensionIncomeConsideration = pensionIncomeConsideration;
    this.realEstateIncomeAlgorithm = realEstateIncomeAlgorithm;
    this.realEstateIncomeConsideration = realEstateIncomeConsideration;
    this.realEstateIncomeConsiderationType = realEstateIncomeConsiderationType;
    this.taxRate = taxRate;
    this.theoreticalInterestRate = theoreticalInterestRate;
    this.theoreticalInterestRate2ndRank = theoreticalInterestRate2ndRank;
    this.theoreticalMaintenanceRate = theoreticalMaintenanceRate;
    this.estimatedCommission = estimatedCommission;
    this.referralCommission = referralCommission;
    this.referralCommissionSplit = referralCommissionSplit;
    this.setMiddleware(middlewares, middlewareObject);
  }

  setMiddleware = (middlewares?: Array<Function>, middlewareObject) => {
    const middlewareManager = new MiddlewareManager(this, middlewareObject);
    middlewareManager.applyToAllMethods([
      precisionMiddleware,
      memoizeMiddleware,
      ...middlewares,
    ]);
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

  checkInterestsAndTranches({
    tranches = [],
    interestRates,
  }: {
    tranches: Array<{ type: string, value: number }>,
    interestRates: Object,
  }) {
    return tranches.reduce((invalidRate, { type }) => {
      if (invalidRate) {
        return invalidRate;
      }

      if (!interestRates[type]) {
        return type;
      }
    }, undefined);
  }

  getInterestsWithTranches({
    tranches = [],
    interestRates,
  }: {
    tranches: Array<{ type: string, value: number }>,
    interestRates: Object,
  } = {}) {
    return tranches.reduce((acc, { type, value }) => {
      const rate = interestRates[type];

      if (!rate || acc === '-') {
        return '-';
      }

      return acc + value * rate;
    }, 0);
  }

  getAmortizationRateBase({
    borrowRatio = 0,
    amortizationYears = this.amortizationYears,
  }: { borrowRatio: number, amortizationRate?: number } = {}) {
    let amortizationRate = 0;
    if (borrowRatio > this.amortizationGoal) {
      // The loan has to be below 65% before 15 years or before retirement,
      // whichever comes first
      const amountToAmortize = borrowRatio - this.amortizationGoal;

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

  getFeesBase({ fees, propertyValue = 0 }) {
    if (fees === 0 || fees > 0) {
      return fees;
    }

    return propertyValue * this.notaryFees;
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

  getAveragedInterestRate({ tranches = [], interestRates = {} }) {
    return tranches.reduce(
      (totalRate, { type, value }) => totalRate + interestRates[type] * value,
      0,
    );
  }
}

export default new FinanceCalculator();
