const constants = {
  cpsLimit: 300, // Average characters typed per second
  amortizing: 0.01125,
  interests: 0.05,
  interestsReal: 0.015,
  maintenance: 0.01,
  maintenanceReal: 0.005,
  notaryFees: 0.05,
  lppFees: 0.1,
  maxRatio: 0.38,
  loanCost() {
    return this.interests + this.amortizing;
  },
  loanCostReal() {
    return this.interestsReal + this.amortizing;
  },

  propertyToIncome(usageType = 'primary') {
    return 3 * (this.maintenance + this.maxLoan(usageType) * this.loanCost());
  },
  propertyToIncomeReal(usageType = 'primary') {
    return 3 *
      (this.maintenanceReal + this.maxLoan(usageType) * this.loanCostReal());
  },
  maxProperty(income, fortune, insuranceFortune = 0, usageType = 'primary') {
    // Fortune should cover 20% and notary fees
    let fortuneLimited = fortune / (1 - this.maxLoan(usageType) + 0.05);
    if (usageType === 'primary') {
      fortuneLimited = calculatePrimaryProperty(fortune, insuranceFortune);
    }

    // The arithmetic relation to have the cost of the loan be at exactly the max ratio of income
    // Derive it like this:
    // maxRatio * salary >= property * maintenance + loan * loanCost
    // loan = (property + notaryFees + lppFees) - totalFortune
    // Extract property from this relation
    let incomeLimited = (this.maxRatio * income +
      (fortune + insuranceFortune * (1 - this.lppFees)) * this.loanCost()) /
      (this.maintenance + (1 + this.notaryFees) * this.loanCost());

    // Because of the ratios, round this value down
    incomeLimited = Math.floor(incomeLimited);

    // Use floor to make sure the ratios are respected and avoid edge cases
    return Math.round(Math.min(fortuneLimited, incomeLimited));
  },
  maxLoan(usageType = 'primary') {
    if (usageType === 'secondary') {
      return 0.7;
    }

    return 0.8;
  },
};

export const calculatePrimaryProperty = (fortune, insuranceFortune) => {
  if (fortune <= 0 || insuranceFortune < 0) {
    return 0;
  }

  const lppFees = insuranceFortune * constants.lppFees;
  const notaryFees = constants.notaryFees;

  // Make sure cash can pay for lppFees, and fortune can cover notaryfees
  const totalFortuneLimitedValue = (fortune - lppFees + insuranceFortune) /
    (0.2 + notaryFees);

  // Make sure cash can pay for lppfees and notaryfees
  const cashLimitedValue = (fortune - lppFees) / (0.1 + notaryFees);

  return Math.max(
    Math.round(Math.min(cashLimitedValue, totalFortuneLimitedValue)),
    0,
  );
};

export default constants;
