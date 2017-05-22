import constants from '../config/constants';

import { getIncomeRatio, getBorrowRatio } from './finance-math';

export const getProjectValue = loanRequest => {
  if (loanRequest.property.value <= 0) {
    return 0;
  }

  let value =
    loanRequest.property.value * (1 + constants.notaryFees) +
    (loanRequest.property.propertyWork || 0);

  if (loanRequest.property.usageType === 'primary') {
    value += (loanRequest.general.insuranceFortuneUsed || 0) * constants.lppFees;
  }

  return Math.max(0, Math.round(value));
};

export const getLoanValue = loanRequest => {
  let value = getProjectValue(loanRequest) - loanRequest.general.fortuneUsed;

  if (loanRequest.property.usageType === 'primary') {
    value -= loanRequest.general.insuranceFortuneUsed || 0;
  }

  // Check negative values
  return Math.max(0, Math.round(value));
};

export const loanStrategySuccess = (loanTranches = [], loanValue) => {
  if (loanTranches.length < 1) {
    return false;
  }
  // User has to choose a preset
  const trancheSum = loanTranches.reduce((tot, tranche) => tranche.value + tot, 0);
  if (trancheSum === loanValue) {
    // If the sum of all tranches is equal to the loan, success!
    return true;
  }

  return false;
};

export const strategiesChosen = loanRequest => {
  return (
    loanStrategySuccess(loanRequest) &&
    loanRequest.logic.amortizationStrategyPreset &&
    loanRequest.logic.hasValidatedCashStrategy
  );
};

export const getMonthlyWithOffer = (
  request,
  fortuneUsed,
  insuranceFortuneUsed,
  tranches,
  interestRates,
  amortization,
) => {
  // Make a copy of the request
  const r = JSON.parse(JSON.stringify(request));

  // Modify it to include additional parameters
  r.general.fortuneUsed = fortuneUsed || r.general.fortuneUsed;
  r.general.insuranceFortuneUsed = insuranceFortuneUsed || r.general.insuranceFortuneUsed;
  const loan = getLoanValue(r);

  const maintenance =
    constants.maintenanceReal * (r.property.value + (r.property.propertyWork || 0));

  let interests = 0;
  tranches.some(tranche => {
    const rate = interestRates[tranche.type];

    // If the lender doesn't have this interest rate, return false
    if (!rate) {
      interests = -1;
      return false;
    }

    interests += tranche.value * rate;
  });

  return interests >= 0 ? Math.round((maintenance + loan * amortization + interests) / 12) : 0;
};

export const getPropAndWork = loanRequest =>
  loanRequest.property.value + (loanRequest.property.propertyWork || 0);

export const getTotalUsed = loanRequest =>
  Math.round(loanRequest.general.fortuneUsed + (loanRequest.general.insuranceFortuneUsed || 0));

export const getLenderCount = (loanRequest, borrowers) => {
  const incomeRatio = getIncomeRatio(loanRequest, borrowers);
  const borrowRatio = getBorrowRatio(loanRequest, borrowers);
  if (incomeRatio > 0.38) {
    return 0;
  } else if (incomeRatio > 1 / 3) {
    return 4;
  } else if (borrowRatio <= 0.65) {
    return 30;
  } else if (borrowRatio > 0.65 && borrowRatio <= 0.9) {
    return 20;
  }

  return 0;
};
