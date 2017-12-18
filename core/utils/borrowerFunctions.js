import { personalInfoPercent } from 'core/arrays/steps';
import { filesPercent } from 'core/arrays/steps';
import { borrowerFiles } from '../api/files/files';
import { arrayify } from './general';

export const getFortune = borrowers => {
  const array = [];

  arrayify(borrowers).forEach(b => {
    array.push(b.bankFortune);
  });
  return array.reduce((tot, val) => (val > 0 && tot + val) || tot, 0);
};

export const getInsuranceFortune = borrowers => {
  const array = [];

  arrayify(borrowers).forEach(b => {
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

export const getBonusIncome = borrowers => {
  let total = 0;
  arrayify(borrowers).forEach(borrower => {
    if (borrower.bonus) {
      let arr = Object.keys(borrower.bonus).map(key => borrower.bonus[key]);
      if (arr.length < 1) {
        return;
      } else if (arr.length > 4) {
        throw new Error('too many bonuses provided');
      }

      arr = arr.map(v => v || 0);
      // Sum all values, remove the lowest one, and return 50% of their average
      let sum = arr.reduce((tot, val) => tot + val, 0);

      if (arr.length > 3) {
        sum -= Math.min(...arr);
      }
      total = 0.5 * (sum / Math.min(3, arr.length)) || 0;
    }
  });

  return Math.max(0, Math.round(total));
};

export const getArrayValues = (borrowers, key, mapFunc) => {
  let sum = 0;

  arrayify(borrowers).forEach(borrower => {
    if (!borrower[key]) {
      return 0;
    }
    sum += [
      ...(borrower[key] ? borrower[key].map(mapFunc || (i => i.value)) : []),
    ].reduce((tot, val) => (val > 0 && tot + val) || tot, 0);
  });

  return Math.max(0, Math.round(sum));
};

export const getOtherIncome = borrowers =>
  getArrayValues(borrowers, 'otherIncome');

export const getExpenses = borrowers => getArrayValues(borrowers, 'expenses');

export const getBorrowerIncome = borrowers => {
  let sum = 0;

  arrayify(borrowers).forEach(borrower => {
    sum += borrower.salary || 0;
    sum += getBonusIncome([borrower]) || 0;
    sum += getOtherIncome([borrower]) || 0;
    sum -= getExpenses([borrower]) || 0;
  });

  return Math.max(sum, 0);
};

export const getTotalFortune = borrowers => {
  let sum = 0;

  arrayify(borrowers).forEach(borrower => {
    sum += borrower.bankFortune || 0;
    sum += borrower.insuranceSecondPillar || 0;
    sum += borrower.insuranceThirdPillar || 0;

    // TODO: Complete!!
  });

  return Math.max(0, Math.round(sum));
};

export const getRealEstateFortune = borrowers =>
  getArrayValues(borrowers, 'realEstate', i => i.value - i.loan);

export const getRealEstateValue = borrowers =>
  getArrayValues(borrowers, 'realEstate');

export const getRealEstateDebt = borrowers =>
  getArrayValues(borrowers, 'realEstate', i => i.loan);

export const getBorrowerSalary = borrowers =>
  arrayify(borrowers).reduce((t, b) => t + (b.salary || 0), 0);
