import { personalInfoPercent } from '/imports/js/arrays/steps';
import { filesPercent } from '/imports/js/arrays/steps';
import { borrowerFiles } from '/imports/js/arrays/files';
import { arrayify } from './general';

export const getFortune = (borrowers) => {
  const array = [];

  arrayify(borrowers).forEach((b) => {
    array.push(b.bankFortune);
  });
  return array.reduce((tot, val) => (val > 0 && tot + val) || tot, 0);
};

export const getInsuranceFortune = (borrowers) => {
  const array = [];

  arrayify(borrowers).forEach((b) => {
    array.push(b.insuranceSecondPillar);
    array.push(b.insuranceThirdPillar);
  });
  return array.reduce((tot, val) => (val > 0 && tot + val) || tot, 0);
};

export const getBorrowerCompletion = borrower =>
  (filesPercent([borrower], borrowerFiles, 'auction') +
    personalInfoPercent([borrower]) +
    (borrower.logic.hasValidatedFinances ? 1 : 0)) /
  3;

export const getBonusIncome = (borrowers) => {
  let total = 0;
  borrowers.forEach((borrower) => {
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

export const getOtherIncome = (borrowers) => {
  let sum = 0;

  borrowers.forEach((borrower) => {
    sum += [
      ...(borrower.otherIncome ? borrower.otherIncome.map(i => i.value) : []),
    ].reduce((tot, val) => (val > 0 && tot + val) || tot, 0);
  });

  return Math.max(0, Math.round(sum));
};

export const getExpenses = (borrowers) => {
  let sum = 0;
  borrowers.forEach((borrower) => {
    sum += [
      ...(borrower.expenses ? borrower.expenses.map(i => i.value) : []),
    ].reduce((tot, val) => (val > 0 && tot + val) || tot, 0);
  });

  return Math.max(0, Math.round(sum));
};

export const getBorrowerIncome = (borrowers) => {
  let sum = 0;

  borrowers.forEach((borrower) => {
    sum += borrower.salary || 0;
    sum += getBonusIncome([borrower]) || 0;
    sum += getOtherIncome([borrower]) || 0;
    sum -= getExpenses([borrower]) || 0;
  });

  return Math.max(sum, 0);
};

export const getTotalFortune = (borrowers) => {
  let sum = 0;

  borrowers.forEach((borrower) => {
    sum += borrower.bankFortune || 0;
    sum += borrower.insuranceSecondPillar || 0;
    sum += borrower.insuranceThirdPillar || 0;

    // TODO: Complete!!
  });

  return Math.max(0, Math.round(sum));
};

export const getRealEstateFortune = (borrowers = []) => {
  let sum = 0;
  borrowers.forEach((borrower) => {
    if (borrower.realEstate) {
      sum += [...borrower.realEstate.map(i => i.value - i.loan || 0)].reduce(
        (tot, val) => (val > 0 && tot + val) || tot,
        0,
      );
    }
  });

  return Math.max(0, Math.round(sum));
};

export const getRealEstateValue = (borrowers) => {
  let sum = 0;
  borrowers.forEach((borrower) => {
    if (borrower.realEstate) {
      sum += [...borrower.realEstate.map(i => i.value || 0)].reduce(
        (tot, val) => (val > 0 && tot + val) || tot,
        0,
      );
    }
  });

  return Math.max(0, Math.round(sum));
};

export const getRealEstateDebt = (borrowers) => {
  let sum = 0;
  borrowers.forEach((borrower) => {
    if (borrower.realEstate) {
      sum += [...borrower.realEstate.map(i => i.loan || 0)].reduce(
        (tot, val) => (val > 0 && tot + val) || tot,
        0,
      );
    }
  });

  return Math.max(0, Math.round(sum));
};

export const getBorrowerSalary = borrowers =>
  borrowers.reduce((t, b) => t + b.salary, 0);
