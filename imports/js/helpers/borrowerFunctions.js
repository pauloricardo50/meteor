import { personalInfoPercent } from '/imports/js/arrays/steps';
import { filesPercent } from '/imports/js/arrays/steps';
import { borrowerFiles } from '/imports/js/arrays/files';

export const getFortune = (borrowers = []) => {
  const array = [];

  borrowers.forEach(b => {
    array.push(b.bankFortune);
  });
  return array.reduce((tot, val) => (val > 0 && tot + val) || tot, 0);
};

export const getInsuranceFortune = (borrowers = []) => {
  const array = [];

  borrowers.forEach(b => {
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
