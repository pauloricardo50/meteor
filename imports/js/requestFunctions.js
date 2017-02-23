export const loanStrategySuccess = (loanRequest) => {
  // User has to choose a preset
  if (loanRequest.logic.loanStrategyPreset) {
    const trancheSum = loanRequest.general.loanTranches.reduce((a, b) => a.value + b.value);
    if (trancheSum === getLoanValue(loanRequest)) {
      // If the sum of all tranches is equal to the loan, success!
      return true;
    }
  }

  return false;
};

export const getLoanValue = (loanRequest) => {
  const val = loanRequest.property.value -
    loanRequest.general.fortuneUsed -
    loanRequest.general.insuranceFortuneUsed;

// Check negative values
  return val <= 0 ? 0 : val;
};

export const strategiesChosen = (loanRequest) => {
  return (
    loanStrategySuccess(loanRequest) &&
    loanRequest.logic.amortizingStrategyPreset &&
    loanRequest.logic.hasValidatedCashStrategy
  );
};
