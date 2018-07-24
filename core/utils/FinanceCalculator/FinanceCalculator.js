// @flow
import { GENDER } from '../../api/constants';
import { NO_INTEREST_RATE_ERROR } from './financeCalculatorConstants';

export class FinanceCalculator {
  constructor(settings?: Object) {
    this.init(settings);
  }

  notaryFees: number;

  amortizationBaseRate: number;

  amortizationGoal: number;

  init({
    notaryFees = 0,
    amortizationBaseRate = 0,
    amortizationGoal = 0,
  }: {
    notaryFees?: number,
    amortizationBaseRate?: number,
    amortizationGoal?: number,
  } = {}) {
    this.notaryFees = notaryFees;
    this.amortizationBaseRate = amortizationBaseRate;
    this.amortizationGoal = amortizationGoal;
  }

  getLoanValue = ({
    propertyValue,
    fortune,
  }: {
    propertyValue: number,
    fortune: number,
  }) => propertyValue * (1 + this.notaryFees) - fortune;

  getBorrowRatio = ({
    propertyValue,
    loan = 0,
  }: {
    propertyValue: number,
    loan: number,
  }) => loan / propertyValue;

  getBorrowRatioWithoutLoan = ({
    propertyValue,
    fortune,
  }: {
    propertyValue: number,
    fortune: number,
  }) => this.getBorrowRatio({
    propertyValue,
    loan: this.getLoanValue({ propertyValue, fortune }),
  });

  getRetirementForGender = ({ gender = GENDER.M }: { gender?: string } = {}) => (gender === GENDER.F ? 64 : 65);

  getIncomeRatio = ({
    income,
    payment = 0,
  }: {
    income: number,
    payment: number,
  }) => payment / income;

  getLoanCost = ({
    maintenance = 0,
    interests = 0,
    amortization = 0,
  }: {
    maintenance?: number,
    interests?: number,
    amortization?: number,
  } = {}) => maintenance + interests + amortization;

  getLoanCostWithParts = ({
    maintenance,
    interests,
    amortization,
  }: {
    maintenance: number,
    interests: number,
    amortization?: number,
  }) => ({
    maintenance,
    interests,
    amortization,
    total: this.getLoanCost({ maintenance, interests, amortization }),
  });

  getInterests = ({
    tranches,
    interestRates,
  }: {
      tranches: Array<{ type: string, value: number }>,
      interestRates: Object,
    } = {
    tranches: [],
    interestRates: {},
  }) => tranches.reduce((acc, { type, value }) => {
    const rate = interestRates[type];

    if (!rate) {
      throw new Error(NO_INTEREST_RATE_ERROR, type);
    }

    return acc + value * rate;
  }, 0);

  getAmortizationRate = ({ borrowRatio, amortizationYears = 15 }) => {
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
  };

  getAmortization = () => {};
}

export default new FinanceCalculator();
