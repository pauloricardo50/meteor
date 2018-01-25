import { USAGE_TYPE } from 'core/api/constants';

const constants = {
  cpsLimit: 300, // Average characters typed per second
  amortization: 0.0125,
  interests: 0.05,
  interestsReal: 0.015,
  maintenance: 0.01,
  maintenanceReal: 0.005,
  notaryFees: 0.05,
  lppFees: 0.1,
  maxRatio: 0.38,
  minCash: 0.1,
  getCurrency: () => 'CHF',
  loanCost(borrowRatio, toRetirement) {
    return this.interests + this.getAmortization(borrowRatio, toRetirement);
  },
  loanCostReal(borrowRatio, toRetirement, interestRate) {
    return (
      (interestRate || this.interestsReal) +
      this.getAmortization(borrowRatio, toRetirement)
    );
  },
  propertyToIncome(usageType = USAGE_TYPE.PRIMARY, borrowRatio, toRetirement) {
    return (
      3 *
      (this.maintenance +
        this.maxLoan(usageType, toRetirement) *
          this.loanCost(borrowRatio, toRetirement))
    );
  },
  propertyToIncomeReal(
    usageType = USAGE_TYPE.PRIMARY,
    borrowRatio,
    toRetirement,
  ) {
    return (
      3 *
      (this.maintenanceReal +
        this.maxLoan(usageType, toRetirement) *
          this.loanCostReal(borrowRatio, toRetirement))
    );
  },
  maxProperty(
    income,
    fortune,
    insuranceFortune = 0,
    usageType = USAGE_TYPE.PRIMARY,
    toRetirement = 15,
  ) {
    let r = toRetirement;
    // Make sure toRetirement is capped between 0 and 15 years
    if (toRetirement < 0) {
      r = 0;
    } else if (toRetirement > 15) {
      r = 15;
    }

    const fortuneLimited = fortuneLimitedProperty(
      income,
      fortune,
      insuranceFortune,
      usageType,
      r,
    );
    const incomeLimited = incomeLimitedProperty(
      income,
      fortune,
      insuranceFortune,
      usageType,
      r,
    );

    // Use floor to make sure the ratios are respected and avoid edge cases
    return Math.round(Math.min(fortuneLimited, incomeLimited));
  },
  maxLoan(usageType = USAGE_TYPE.PRIMARY, toRetirement = 15) {
    if (toRetirement <= 0) {
      return 0.65;
    }
    if (usageType === USAGE_TYPE.SECONDARY) {
      return 0.7;
    }

    return 0.8;
  },
  getAmortization: (borrowRatio = 0.8, toRetirement = 15) => {
    if (borrowRatio > 0.65) {
      const toAmortize = borrowRatio - 0.65;
      if (toRetirement > 15) {
        // use parseFloat, to round to 15 decimals, which is the maximal guaranteed precision of floating pt. numbers
        return Math.max(parseFloat(toAmortize / borrowRatio / 15).toPrecision(15));
      } else if (toRetirement >= 0) {
        // use parseFloat, to round to 15 decimals, which is the maximal guaranteed precision of floating pt. numbers
        return Math.max(parseFloat(toAmortize / borrowRatio / toRetirement).toPrecision(15));
      }
      return parseFloat(toAmortize / borrowRatio).toPrecision(15);
    }

    return 0;
  },
};

export const fortuneLimitedProperty = (
  income,
  fortune,
  insuranceFortune = 0,
  usageType = USAGE_TYPE.PRIMARY,
  toRetirement = 15,
) => {
  let fortuneLimited = 0;

  if (usageType === USAGE_TYPE.PRIMARY) {
    // Use insuranceFortune to calculate more complicated value which
    // includes lppFees
    fortuneLimited = calculatePrimaryProperty(fortune, insuranceFortune);
  } else {
    // Fortune should cover 20% and notary fees
    fortuneLimited =
      fortune / (1 - constants.maxLoan(usageType, toRetirement) + 0.05);
  }
  return fortuneLimited;
};

export const incomeLimitedProperty = (
  income,
  fortune,
  insuranceFortune = 0,
  usageType = USAGE_TYPE.PRIMARY,
  toRetirement = 15,
) => {
  // The arithmetic relation to have the cost of the loan be at exactly the max ratio of income
  // Derive it like this:
  // maxRatio * salary >= property * maintenance + loan * loanCost
  // loan = (property + notaryFees + lppFees) - totalFortune
  // Extract property from this relation
  const totalFortune = fortune + insuranceFortune;
  const lppFees = insuranceFortune * constants.lppFees;
  const nF = constants.notaryFees;
  const i = constants.interests;
  const mR = constants.maxRatio;
  const m = constants.maintenance;
  const r = toRetirement;

  // The first one is with 0 amortization
  const incomeLimited1 =
    (mR * income + (totalFortune - lppFees) * i) / (m + (1 + nF) * i);

  // The second is with amortization factored in (and it could be negative due to math)
  const incomeLimited2 =
    ((1 + r * i) * (totalFortune - lppFees) + mR * r * income) /
    (r * (m + i) + nF * (1 + r * i) + 0.35);

  // Therefore, take the minimum value of both, which is the most limiting one
  // Because of the ratios, round this value down
  return Math.floor(Math.min(incomeLimited1, incomeLimited2));
};

export const calculatePrimaryProperty = (fortune, insuranceFortune) => {
  if (fortune <= 0 || insuranceFortune < 0) {
    return 0;
  }

  const lppFees = insuranceFortune * constants.lppFees;
  const notaryFees = constants.notaryFees;

  // Make sure cash can pay for lppFees, and fortune can cover notaryfees
  const totalFortuneLimitedValue =
    (fortune - lppFees + insuranceFortune) / (0.2 + notaryFees);

  // Make sure cash can pay for lppfees and notaryfees
  const cashLimitedValue = (fortune - lppFees) / (0.1 + notaryFees);

  return Math.max(
    Math.round(Math.min(cashLimitedValue, totalFortuneLimitedValue)),
    0,
  );
};

export default constants;
