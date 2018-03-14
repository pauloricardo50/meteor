import {
  NOTARY_FEES,
  AMORTIZATION_STOP,
  MAINTENANCE_REAL,
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

export const getSimpleYearlyMaintenance = propertyValue =>
  MAINTENANCE_REAL * propertyValue;
