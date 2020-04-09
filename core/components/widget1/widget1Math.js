import { ERROR, SUCCESS, WARNING } from '../../api/constants';
import {
  AMORTIZATION_STOP,
  FORTUNE_ERROR,
  FORTUNE_WARNING_TIGHT,
  INCOME_ERROR,
  INCOME_WARNING_TIGHT,
  INTERESTS_FINMA,
  MAINTENANCE_FINMA,
  MAINTENANCE_REAL,
  MAX_BORROW_RATIO_OTHER,
  MAX_BORROW_RATIO_PRIMARY_PROPERTY,
  MAX_BORROW_RATIO_WITH_PLEDGE,
  MAX_INCOME_RATIO,
  MAX_INCOME_RATIO_TIGHT,
  NOTARY_FEES,
} from '../../config/financeConstants';

export const getLoanValue = (propertyValue, fortune) =>
  propertyValue * (1 + NOTARY_FEES) - fortune;

export const getRefinancingBorrowRatio = (propertyValue, loan) =>
  loan / propertyValue;

export const getBorrowRatio = (propertyValue, fortune) =>
  getRefinancingBorrowRatio(
    propertyValue,
    getLoanValue(propertyValue, fortune),
  );

export const getYearlyAmortization = ({
  propertyValue,
  loanValue,
  yearsToRetirement = 15,
}) => {
  const borrowValue = loanValue / propertyValue;
  const percentToAmortize = borrowValue - AMORTIZATION_STOP;

  if (percentToAmortize <= 0) {
    // If you're below the cut-off value, no need to amortize
    return 0;
  }

  // borrowValue is above 65%
  // 15 years amortization is the default, but if you're older, you'll
  // have to amortize faster
  return (percentToAmortize * propertyValue) / yearsToRetirement;
};

// Given the value of a property, the down payment and interest rate,
// return the yearly interests to pay.
// This includes the money lost through NOTARY_FEES
export const getSimpleYearlyInterests = (loanValue, interests) =>
  loanValue * interests;

export const getSimpleYearlyMaintenance = (
  propertyValue,
  maintenanceRate = MAINTENANCE_REAL,
) => maintenanceRate * propertyValue;

export const getIncomeRatio = (yearlySalary, monthlyCost) =>
  monthlyCost / (yearlySalary / 12);

export const getFinmaMonthlyCost = (propertyValue, fortune, wantedLoan) => {
  const maintenanceMonthly =
    getSimpleYearlyMaintenance(propertyValue, MAINTENANCE_FINMA) / 12;
  const loanValue = wantedLoan || getLoanValue(propertyValue, fortune);
  const interestsMonthly =
    getSimpleYearlyInterests(loanValue, INTERESTS_FINMA) / 12;
  const amortizationMonthly =
    getYearlyAmortization({ propertyValue, loanValue }) / 12;

  return {
    maintenanceMonthly,
    interestsMonthly,
    amortizationMonthly,
    totalMonthly: maintenanceMonthly + interestsMonthly + amortizationMonthly,
  };
};

export const validateIncomeRatio = incomeRatio => {
  // add 0.01% to avoid rounding issues
  const safeIncomeRatio = incomeRatio - 0.0001;
  if (safeIncomeRatio <= MAX_INCOME_RATIO) {
    return { status: SUCCESS, error: undefined };
  }
  if (safeIncomeRatio <= MAX_INCOME_RATIO_TIGHT) {
    return { status: WARNING, error: INCOME_WARNING_TIGHT };
  }

  return { status: ERROR, error: INCOME_ERROR };
};

export const validateBorrowRatio = (
  borrowRatio,
  isPrimary = true,
  allowInsurance = true,
) => {
  const maxRatio = isPrimary
    ? MAX_BORROW_RATIO_PRIMARY_PROPERTY
    : MAX_BORROW_RATIO_OTHER;

  if (borrowRatio <= maxRatio) {
    return { status: SUCCESS, error: undefined };
  }
  if (allowInsurance && borrowRatio <= MAX_BORROW_RATIO_WITH_PLEDGE) {
    return { status: WARNING, error: FORTUNE_WARNING_TIGHT };
  }

  return { status: ERROR, error: FORTUNE_ERROR };
};
