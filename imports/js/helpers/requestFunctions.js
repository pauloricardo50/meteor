import constants from '../config/constants';

export const getProjectValue = loanRequest => {
  if (loanRequest.property.value <= 0) {
    return 0;
  }

  let value = loanRequest.property.value * (1 + constants.notaryFees) +
    (loanRequest.property.propertyWork || 0);

  if (loanRequest.general.usageType === 'primary') {
    value += (loanRequest.general.insuranceFortuneUsed || 0) *
      constants.lppFees;
  }

  return Math.max(0, value);
};

export const getLoanValue = loanRequest => {
  let value = getProjectValue(loanRequest) - loanRequest.general.fortuneUsed;

  if (loanRequest.general.usageType === 'primary') {
    value -= loanRequest.general.insuranceFortuneUsed || 0;
  }

  // Check negative values
  return Math.max(0, value);
};

export const loanStrategySuccess = loanRequest => {
  // User has to choose a preset
  if (loanRequest.logic.loanStrategyPreset) {
    const trancheSum = loanRequest.general.loanTranches.reduce(
      (a, b) => a.value + b.value,
    );
    if (trancheSum === getLoanValue(loanRequest)) {
      // If the sum of all tranches is equal to the loan, success!
      return true;
    }
  }

  return false;
};

export const strategiesChosen = loanRequest => {
  return loanStrategySuccess(loanRequest) &&
    loanRequest.logic.amortizingStrategyPreset &&
    loanRequest.logic.hasValidatedCashStrategy;
};
