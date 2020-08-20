import { PURCHASE_TYPE } from '../../../api/loans/loanConstants';
import Calculator from '../../../utils/Calculator';

export const parseMaxPropertyValue = (loan, showBest) => {
  const { maxPropertyValue: mPV, purchaseType, residenceType } = loan;
  const { canton } = mPV;
  const {
    propertyValue: minPropertyValue,
    borrowRatio: minBorrowRatio,
    organisationName: minOrganisationName,
  } = mPV.min;
  const {
    propertyValue: maxPropertyValue,
    borrowRatio: maxBorrowRatio,
    organisationName: maxOrganisationName,
  } = mPV.max;
  const previousLoan = Calculator.getPreviousLoanValue({ loan });

  const minLoan = minPropertyValue * minBorrowRatio;
  const maxLoan = maxPropertyValue * maxBorrowRatio;

  const minNotaryFees = Calculator.getNotaryFees({
    loan: Calculator.createLoanObject({
      residenceType,
      wantedLoan: minLoan,
      propertyValue: minPropertyValue,
      canton,
      purchaseType,
    }),
  }).total;
  const maxNotaryFees = Calculator.getNotaryFees({
    loan: Calculator.createLoanObject({
      residenceType,
      wantedLoan: maxLoan,
      propertyValue: maxPropertyValue,
      canton,
      purchaseType,
    }),
  }).total;

  const minOwnFunds = minPropertyValue * (1 - minBorrowRatio) + minNotaryFees;
  const maxOwnFunds = maxPropertyValue * (1 - maxBorrowRatio) + maxNotaryFees;

  const propertyValue = showBest ? maxPropertyValue : minPropertyValue;
  const notaryFees = showBest ? maxNotaryFees : minNotaryFees;
  const ownFunds = showBest ? maxOwnFunds : minOwnFunds;
  const loanValue = showBest ? maxLoan : minLoan;
  const raise = loan - previousLoan;

  const valueToDisplay =
    purchaseType === PURCHASE_TYPE.REFINANCING ? loan : propertyValue;

  return {
    propertyValue,
    notaryFees,
    ownFunds,
    loanValue,
    raise,
    valueToDisplay,
    minOrganisationName,
    maxOrganisationName,
    previousLoan,
  };
};
