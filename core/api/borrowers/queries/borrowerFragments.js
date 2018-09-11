import { appUserFragment } from '../../users/queries/userFragments';
import { loanBaseFragment } from '../../loans/queries/loanFragments';

export const baseBorrowerFragment = {
  firstName: 1,
  lastName: 1,
  name: 1,
  createdAt: 1,
  updatedAt: 1,
  $options: { sort: { createdAt: 1 } },
};

export const loanBorrowerFragment = {
  ...baseBorrowerFragment,
  address1: 1,
  adminValidation: 1,
  age: 1,
  bankFortune: 1,
  birthPlace: 1,
  bonus2015: 1,
  bonus2016: 1,
  bonus2017: 1,
  bonus2018: 1,
  bonusExists: 1,
  childrenCount: 1,
  city: 1,
  civilStatus: 1,
  citizenship: 1,
  company: 1,
  corporateBankExists: 1,
  expenses: 1,
  gender: 1,
  insurance2: 1,
  insurance3A: 1,
  bank3A: 1,
  insurance3B: 1,
  isSwiss: 1,
  isUSPerson: 1,
  logic: 1,
  otherFortune: 1,
  otherIncome: 1,
  personalBank: 1,
  realEstate: 1,
  residencyPermit: 1,
  salary: 1,
  sameAddress: 1,
  worksForOwnCompany: 1,
  zipCode: 1,
};

export const adminBorrowerFragment = {
  ...loanBorrowerFragment,
  loans: loanBaseFragment,
  user: appUserFragment,
};

export const sideNavBorrowerFragment = {
  ...baseBorrowerFragment,
  user: { assignedEmployee: { email: 1 } },
  loans: { name: 1 },
};
