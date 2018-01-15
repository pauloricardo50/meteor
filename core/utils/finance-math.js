import constants from '../config/constants';
import {
  getLoanValue,
  getPropAndWork,
  getMaintenance,
  getFees,
} from './requestFunctions';
import {
  getFortune,
  getInsuranceFortune,
  getTotalFortune,
  getBorrowerIncome,
} from './borrowerFunctions';
import { arrayify } from './general';

// Determine retirement age depending on the gender of the borrowers
// Return a positive value only, negative values rounded to 0
export const getYearsToRetirement = (age1, age2, gender1, gender2) => {
  const retirement1 = gender1 === 'f' ? 64 : 65;
  let retirement2 = null;
  if (gender2) {
    retirement2 = gender2 === 'f' ? 64 : 65;
  }

  // Substract age to determine remaining time to retirement for both borrowers
  const toRetirement1 = retirement1 - age1;
  let toRetirement2;
  if (retirement2 && age2) {
    toRetirement2 = retirement2 - age2;
  }

  // Get the most limiting time to retirement for both borrowers, in years
  let yearsToRetirement;
  if (toRetirement2) {
    yearsToRetirement = Math.min(toRetirement1, toRetirement2);
  } else {
    yearsToRetirement = toRetirement1;
  }

  return Math.max(yearsToRetirement, 0);
};

// get monthly amortization for a loan request
export const getAmortization = (loanRequest, borrowers) => {
  const loan = getLoanValue(loanRequest);
  const propAndWork = getPropAndWork(loanRequest);
  const safeBorrowers = arrayify(borrowers);
  const yearsToRetirement = getYearsToRetirement(
    Number(safeBorrowers[0].age),
    safeBorrowers[1] && safeBorrowers[1].age ? Number(safeBorrowers[1].age) : 0,
    safeBorrowers[0].gender,
    safeBorrowers[1] && safeBorrowers[1].gender,
  );

  // fallback if the loan is smaller than 0
  if (loan <= 0) {
    return 0;
  }

  const loanPercent = loan / propAndWork;

  let yearlyAmortization = 0;
  const remainingYears = Math.min(yearsToRetirement, 15);
  if (loanPercent > 0.65) {
    // The loan has to be below 65% before 15 years or before retirement,
    // whichever comes first
    const amountToAmortize = (loanPercent - 0.65) * propAndWork;

    // Make sure we don't create a black hole, or use negative values by error
    if (remainingYears > 0) {
      // Amortization is the amount to amortize divided by the amount
      // of years before the deadline
      yearlyAmortization = amountToAmortize / remainingYears;
    }
  } else {
    // For projects below 65%, stop amortizing
    // yearlyAmortization = propAndWork * constants.amortization;
  }

  return { amortization: yearlyAmortization / 12, years: remainingYears };
};

// get interest to pay for a loanrequest every month
export const getInterests = (loanRequest, rate, loanValue) => {
  const loan = loanValue || getLoanValue(loanRequest);

  if (loan <= 0) {
    throw new Error('negative loan');
  }

  // Use a base interest rate of 1.5%
  const interests = rate || 0.015;

  return loan * interests / 12;
};

export const getMonthlyPayment = (loanRequest, borrowers) => {
  const interests = getInterests(loanRequest);
  const { amortization } = getAmortization(loanRequest, borrowers);
  const maintenance = getMaintenance(loanRequest);

  return {
    total: amortization + interests + maintenance,
    amortization,
    interests,
    maintenance,
  };
};

export const getTheoreticalMonthly = (loanRequest, borrowers) => {
  const maintenance = getPropAndWork(loanRequest) * constants.maintenance / 12;
  const loan = getLoanValue(loanRequest);

  const interests = loan * constants.interests / 12;
  const { amortization } = getAmortization(loanRequest, borrowers);

  return {
    total: amortization + interests + maintenance,
    amortization,
    interests,
    maintenance,
  };
};

export const getIncomeRatio = (loanRequest, borrowers) => {
  const monthlyPayment = getTheoreticalMonthly(loanRequest, borrowers).total;
  const borrowerIncome = getBorrowerIncome(borrowers) / 12;

  // Add infinity check
  if (borrowerIncome > 0) {
    return monthlyPayment / borrowerIncome;
  }
  return '-';
};

export const canAffordRank1 = (loanRequest, borrowers) => {
  const propAndWork = getPropAndWork(loanRequest);
  const totalFortune = getTotalFortune(borrowers);
  const fortune = getFortune(borrowers);
  const insuranceFortune = getInsuranceFortune(borrowers);
  const fortuneRequired =
    0.35 * propAndWork + loanRequest.property.value * constants.notaryFees;

  if (fortune >= fortuneRequired) {
    return true;
  }

  if (loanRequest.property && loanRequest.property.usageType === 'primary') {
    if (fortune + insuranceFortune >= fortuneRequired) {
      // ignore lppFees
      return true;
    }
  }
  return false;
};
