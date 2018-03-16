import { SUCCESS, WARNING, ERROR } from '../api/constants';

import {
  NOTARY_FEES,
  AMORTIZATION_STOP,
  MAINTENANCE_REAL,
  MAINTENANCE_FINMA,
  INTERESTS_FINMA,
  MAX_BORROW_RATIO_PRIMARY_PROPERTY,
  MAX_BORROW_RATIO_OTHER,
  MAX_BORROW_RATIO_WITH_INSURANCE,
  FORTUNE_WARNING_TIGHT,
  INCOME_WARNING_TIGHT,
  FORTUNE_ERROR,
  INCOME_ERROR,
} from '../config/financeConstants';

export const getLoanValue = (propertyValue, fortune) =>
  propertyValue * (1 + NOTARY_FEES) - fortune;

export const getBorrowRatio = (propertyValue, fortune) =>
  getLoanValue(propertyValue, fortune) / propertyValue;

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
  return percentToAmortize * propertyValue / yearsToRetirement;
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

export const getFinmaMonthlyCost = (propertyValue, fortune) => {
  const maintenanceMonthly =
    getSimpleYearlyMaintenance(propertyValue, MAINTENANCE_FINMA) / 12;
  const loanValue = getLoanValue(propertyValue, fortune);
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

export const validateIncomeRatio = (incomeRatio) => {
  const safeIncomeRatio = incomeRatio - 0.01;
  if (safeIncomeRatio <= 1 / 3) {
    return { status: SUCCESS, error: undefined };
  } else if (safeIncomeRatio <= 0.38) {
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
  } else if (allowInsurance && borrowRatio <= MAX_BORROW_RATIO_WITH_INSURANCE) {
    return { status: WARNING, error: FORTUNE_WARNING_TIGHT };
  }

  return { status: ERROR, error: FORTUNE_ERROR };
};
