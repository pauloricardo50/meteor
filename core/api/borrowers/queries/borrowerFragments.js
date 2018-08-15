import { appUserFragment } from '../../users/queries/userFragments';
import { loanSummaryFragment } from '../../loans/queries/loanFragments';

export const baseBorrowerFragment = {
  firstName: 1,
  lastName: 1,
  createdAt: 1,
  updatedAt: 1,
};

export const loanBorrowerFragment = {
  ...baseBorrowerFragment,
  address1: 1,
  adminValidation: 1,
  age: 1,
  bankFortune: 1,
  birthPlace: 1,
  bonus: 1,
  bonusExists: 1,
  childrenCount: 1,
  city: 1,
  civilStatus: 1,
  company: 1,
  corporateBankExists: 1,
  documents: 1,
  expenses: 1,
  gender: 1,
  insuranceSecondPillar: 1,
  insuranceThirdPillar: 1,
  isSwiss: 1,
  isUSPerson: 1,
  logic: 1,
  otherFortune: 1,
  otherIncome: 1,
  personalBank: 1,
  realEstate: 1,
  salary: 1,
  sameAddress: 1,
  worksForOwnCompany: 1,
  zipCode: 1,
};

export const adminBorrowerFragment = {
  ...loanBorrowerFragment,
  loans: loanSummaryFragment,
  user: appUserFragment,
};

export const sideNavBorrowerFragment = {
  ...baseBorrowerFragment,
  user: { assignedEmployee: { email: 1 } },
};
