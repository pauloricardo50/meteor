import constants from '../config/constants';
import { getLoanValue } from './requestFunctions';

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
  const r = loanRequest;
  const loan = getLoanValue(loanRequest);
  const yearsToRetirement = getYearsToRetirement(
    Number(borrowers[0].age),
    borrowers[1] && borrowers[1].age ? Number(borrowers[1].age) : 0,
    borrowers[0].gender,
    borrowers[1] && borrowers[1].gender,
  );

  // fallback if the loan is smaller than 0
  if (loan <= 0) {
    return 0;
  }

  const loanPercent = loan / r.property.value;

  let yearlyAmortization = 0;
  if (loanPercent > 0.65) {
    // The loan has to be below 65% before 15 years or before retirement, whichever comes first
    const remainingYears = Math.min(yearsToRetirement, 15);
    const amountToAmortize = (loanPercent - 0.65) * r.property.value;

    // Make sure we don't create a black hole, or use negative values by error
    if (remainingYears > 0) {
      // Amortization is the amount to amortize divided by the amount of years before the deadline
      yearlyAmortization = amountToAmortize / remainingYears;
    }
  }

  return yearlyAmortization / 12;
};

// get interest to pay for a loanrequest every month
export const getInterests = loanRequest => {
  const loan = getLoanValue(loanRequest);

  if (loan <= 0) {
    return 0;
  }

  // Use a base interest rate of 1.5%
  const interests = 0.015;
  if (loanRequest.logic.hasChosenStrategy) {
    // TODO: return real interest rate
  }

  return loan * interests / 12;
};

// Returns the maintenance to pay every month, i.e. 1% of the property divided by 12 months
export const getMaintenance = loanRequest => {
  return loanRequest.property.value * 0.01 / 12;
};

export const getMonthlyPayment = (loanRequest, borrowers) => {
  const interests = getInterests(loanRequest);
  const amortization = getAmortization(loanRequest, borrowers);
  const maintenance = getMaintenance(loanRequest);

  return [
    amortization + interests + maintenance,
    amortization,
    interests,
    maintenance,
  ];
};

export const getBonusIncome = borrowers => {
  let total = 0;
  borrowers.forEach(borrower => {
    if (borrower.bonus) {
      const arr = Object.values(borrower.bonus);
      if (arr.length < 1) {
        return false;
      }
      // Sum all values, remove the lowest one, and return 50% of their average
      const safeArray = arr.map(v => v || 0);
      const sum = safeArray.reduce((tot, val) => tot + val, 0);
      const bestSum = sum - Math.min(...safeArray);
      total = 0.5 * (bestSum / 3) || 0;
    } else {
      return false;
    }
  });

  return Math.max(0, Math.round(total));
};

export const getOtherIncome = borrowers => {
  let sum = 0;

  borrowers.forEach(borrower => {
    sum += [
      ...(borrower.otherIncome ? borrower.otherIncome.map(i => i.value) : []),
    ].reduce((tot, val) => (val > 0 && tot + val) || tot, 0);
  });

  return Math.max(0, Math.round(sum));
};

export const getExpenses = borrowers => {
  let sum = 0;
  borrowers.forEach(borrower => {
    sum += [
      ...(borrower.expenses ? borrower.expenses.map(i => i.value) : []),
    ].reduce((tot, val) => (val > 0 && tot + val) || tot, 0);
  });

  return Math.max(0, Math.round(sum));
};

export const getBorrowerIncome = borrowers => {
  let sum = 0;

  borrowers.forEach(borrower => {
    sum += borrower.salary;
    sum += getBonusIncome([borrower]);
    sum += getOtherIncome([borrower]);
    sum -= getExpenses([borrower]);
  });

  return Math.max(sum, 0);
};

export const getIncomeRatio = (loanRequest, borrowers) => {
  const monthlyPayment = getMonthlyPayment(loanRequest, borrowers)[0];

  return monthlyPayment / (getBorrowerIncome(borrowers) / 12);
};

export const getBorrowRatio = (loanRequest, borrowers) => {
  const loan = getLoanValue(loanRequest);
  const propAndWork = loanRequest.property.value +
    loanRequest.property.propertyWork;

  return loan / propAndWork;
};

export const getFortune = borrowers => {
  let sum = 0;

  borrowers.forEach(borrower => {
    sum += borrower.bankFortune;
  });

  return Math.max(0, Math.round(sum));
};

export const getInsuranceFortune = borrowers => {
  let sum = 0;

  borrowers.forEach(borrower => {
    sum += borrower.insuranceSecondPillar || 0;
    sum += borrower.insuranceThirdPillar || 0;
  });

  return Math.max(0, Math.round(sum));
};

export const getTotalFortune = borrowers => {
  let sum = 0;

  borrowers.forEach(borrower => {
    sum += borrower.bankFortune;
    sum += borrower.insuranceSecondPillar || 0;
    sum += borrower.insuranceThirdPillar || 0;

    // TODO: Complete!!
  });

  return Math.max(0, Math.round(sum));
};

export const getRealEstateFortune = borrowers => {
  let sum = 0;
  borrowers.forEach(borrower => {
    sum += [...borrower.realEstate.map(i => i.value - i.loan || 0)].reduce(
      (tot, val) => (val > 0 && tot + val) || tot,
      0,
    );
  });

  return Math.max(0, Math.round(sum));
};

export const getRealEstateValue = borrowers => {
  let sum = 0;
  borrowers.forEach(borrower => {
    sum += [...borrower.realEstate.map(i => i.value || 0)].reduce(
      (tot, val) => (val > 0 && tot + val) || tot,
      0,
    );
  });

  return Math.max(0, Math.round(sum));
};

export const getRealEstateDebt = borrowers => {
  let sum = 0;
  borrowers.forEach(borrower => {
    sum += [...borrower.realEstate.map(i => i.loan || 0)].reduce(
      (tot, val) => (val > 0 && tot + val) || tot,
      0,
    );
  });

  return Math.max(0, Math.round(sum));
};

export const getBorrowerSalary = borrowers =>
  borrowers.reduce((t, b) => t + b.salary, 0);
