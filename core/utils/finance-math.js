import { GENDER, USAGE_TYPE } from '../api/constants';
import * as constants from '../config/constants';
import {
  NOTARY_FEES,
  MAINTENANCE_FINMA,
  INTERESTS_FINMA,
} from '../config/financeConstants';
import { getLoanValue, getPropAndWork, getMaintenance } from './loanFunctions';
import {
  getFortune,
  getInsuranceFortune,
  getTotalFortune,
  getBorrowerIncome,
} from './borrowerFunctions';
import { arrayify } from './general';

export const getRetirementForGender = gender => (gender === GENDER.F ? 64 : 65);

// Determine retirement age depending on the gender of the borrowers
// Return a positive value only, negative values rounded to 0
export const getYearsToRetirement = (age1, age2, gender1, gender2) => {
  const retirement1 = getRetirementForGender(gender1);
  let retirement2 = null;
  if (gender2) {
    retirement2 = getRetirementForGender(gender2);
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

// get monthly amortization for a loan loan
export const getAmortization = ({ loan, borrowers, property }) => {
  const loanValue = getLoanValue({ loan, property });
  const propAndWork = getPropAndWork({ loan, property });
  const safeBorrowers = arrayify(borrowers);
  const yearsToRetirement = getYearsToRetirement(
    safeBorrowers[0] ? Number(safeBorrowers[0].age) : undefined,
    safeBorrowers[1] && safeBorrowers[1].age ? Number(safeBorrowers[1].age) : 0,
    safeBorrowers[0] ? safeBorrowers[0].gender : undefined,
    safeBorrowers[1] && safeBorrowers[1].gender,
  );

  // fallback if the loan is smaller than 0
  if (loanValue <= 0) {
    return 0;
  }

  const loanPercent = loanValue / propAndWork;

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

// get interest to pay for a loan every month
export const getInterests = ({ loan, property }, rate, loanValue) => {
  loanValue = loanValue || getLoanValue({ loan, property });

  if (loanValue <= 0) {
    throw new Error('negative loan');
  }

  // Use a base interest rate of 1.5%
  const interests = rate || 0.015;

  return (loanValue * interests) / 12;
};

export const getMonthlyPayment = ({ loan, borrowers, property }) => {
  const interests = getInterests({ loan, property });
  const { amortization } = getAmortization({
    loan,
    borrowers,
    property,
  });
  const maintenance = getMaintenance({ loan, property });

  return {
    total: amortization + interests + maintenance,
    amortization,
    interests,
    maintenance,
  };
};

export const getTheoreticalMonthly = ({ loan, borrowers, property }) => {
  const maintenance =
    (getPropAndWork({ loan, property }) * MAINTENANCE_FINMA) / 12;
  const loanValue = getLoanValue({ loan, property });

  const interests = (loanValue * INTERESTS_FINMA) / 12;
  const { amortization } = getAmortization({
    loan,
    borrowers,
    property,
  });

  return {
    total: amortization + interests + maintenance,
    amortization,
    interests,
    maintenance,
  };
};

export const getIncomeRatio = ({ loan, borrowers, property }) => {
  const { total: monthlyPayment } = getTheoreticalMonthly({
    loan,
    borrowers,
    property,
  });
  const borrowerIncome = getBorrowerIncome({ borrowers }) / 12;

  // Add infinity check
  if (borrowerIncome > 0) {
    return monthlyPayment / borrowerIncome;
  }
  return '-';
};

export const canAffordRank1 = ({ loan, borrowers, property }) => {
  const propAndWork = getPropAndWork({ loan, property });
  const totalFortune = getTotalFortune({ borrowers });
  const fortune = getFortune({ borrowers });
  const insuranceFortune = getInsuranceFortune({ borrowers });
  const fortuneRequired = 0.35 * propAndWork + property.value * NOTARY_FEES;

  if (fortune >= fortuneRequired) {
    return true;
  }

  if (loan.general && loan.general.usageType === USAGE_TYPE.PRIMARY) {
    if (fortune + insuranceFortune >= fortuneRequired) {
      // ignore lppFees
      return true;
    }
  }
  return false;
};
