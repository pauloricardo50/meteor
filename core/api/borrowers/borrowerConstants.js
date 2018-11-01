// @flow
export const BORROWERS_COLLECTION = 'borrowers';

export const RESIDENCY_PERMIT = {
  B: 'b',
  C: 'c',
  CI: 'ci',
  F: 'f',
  G: 'g',
  L: 'l',
  N: 'n',
  S: 's',
  NONE: 'none',
};

export const GENDER = {
  M: 'M',
  F: 'F',
  OTHER: 'OTHER',
};

export const CIVIL_STATUS = {
  MARRIED: 'MARRIED',
  SINGLE: 'SINGLE',
  PACSED: 'PACSED',
  DIVORCED: 'DIVORCED',
  WIDOW: 'WIDOW',
};

export const OTHER_INCOME = {
  WELFARE: 'WELFARE',
  PENSIONS: 'PENSIONS',
  REAL_ESTATE: 'REAL_ESTATE',
  INVESTMENT: 'INVESTMENT',
  OTHER: 'OTHER',
};

export const EXPENSES = {
  LEASING: 'LEASING',
  PERSONAL_LOAN: 'PERSONAL_LOAN',
  MORTGAGE_LOAN: 'MORTGAGE_LOAN',
  PENSIONS: 'PENSIONS',
  OTHER: 'OTHER',
};

export const BORROWER_QUERIES = {
  BORROWER: 'BORROWER',
  ADMIN_BORROWERS: 'ADMIN_BORROWERS',
  BORROWER_ASSIGNED_TO: 'BORROWER_ASSIGNED_TO',
  SIDENAV_BORROWERS: 'SIDENAV_BORROWERS',
  BORROWER_SEARCH: 'BORROWER_SEARCH',
};

export const OWN_FUNDS_TYPES = {
  BANK_FORTUNE: 'bankFortune',
  INSURANCE_2: 'insurance2',
  INSURANCE_3A: 'insurance3A',
  BANK_3A: 'bank3A',
  INSURANCE_3B: 'insurance3B',
  THIRD_PARTY_FORTUNE: 'thirdPartyFortune',
};

export const RETIREMENT_AGE = {
  [GENDER.M]: 65,
  [GENDER.F]: 64,
};
