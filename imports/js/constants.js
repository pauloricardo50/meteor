const constants = {
  maxRatio: 0.35,
  cpsLimit: 300, // Average characters typed per second
  amortizing: 0.01125,
  interests: 0.05,
  interestsReal: 0.015,
  maintenance: 0.01,
  maintenanceReal: 0.005,
  loanCost() {
    return this.interests + this.amortizing;
  },
  loanCostReal() {
    return this.interestsReal + this.amortizing;
  },
  notaryFees: 0.05,
  propertyToIncome(usageType = 'primary') {
    return 3 * (this.maintenance + this.maxLoan(usageType) * this.loanCost());
  },
  propertyToIncomeReal(usageType = 'primary') {
    return 3 *
      (this.maintenanceReal + this.maxLoan(usageType) * this.loanCostReal());
  },
  maxLoan(usageType = 'primary') {
    if (usageType === 'secondary') {
      return 0.7;
    }

    return 0.8;
  },
};

export default constants;
