const constants = {
  maxRatio: 0.35,
  cpsLimit: 300, // Average characters typed per second
  amortizing: 0.0125,
  interests: 0.05,
  interestsReal: 0.015,
  maintenance: 0.01,
  maintenanceReal: 0.005,
  loanCost: 0.05 + 0.0125,
  loanCostReal: 0.015 + 0.0125,
  notaryFees: 0.05,
  propertyToIncome() { return 3 * (this.maintenance + (0.8 * this.loanCost)); },
  propertyToIncomeReal() { return 3 * (this.maintenanceReal + (0.8 * this.loanCostReal)); },
};

export default constants;
