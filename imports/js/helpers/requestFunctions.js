import constants from '../config/constants';

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

export const getLoanValue = loanRequest => {
  const val = getProjectValue(loanRequest) -
    loanRequest.general.fortuneUsed -
    (loanRequest.general.insuranceFortuneUsed || 0);

  // Check negative values
  return val <= 0 ? 0 : val;
};

export const strategiesChosen = loanRequest => {
  return loanStrategySuccess(loanRequest) &&
    loanRequest.logic.amortizingStrategyPreset &&
    loanRequest.logic.hasValidatedCashStrategy;
};

export const getProjectValue = loanRequest => {
  return loanRequest.property.value * (1 + constants.notaryFees) +
    loanRequest.property.propertyWork +
    (loanRequest.insuranceFortuneUsed || 0) * constants.lppFees;
};
