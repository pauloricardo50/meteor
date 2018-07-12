export const SALARY = 'salary';
export const FORTUNE = 'fortune';
export const PROPERTY = 'property';
export const CURRENT_LOAN = 'currentLoan';
export const WANTED_LOAN = 'wantedLoan';
export const ACQUISITION_FIELDS = [PROPERTY, SALARY, FORTUNE];
export const REFINANCING_FIELDS = [PROPERTY, SALARY, CURRENT_LOAN, WANTED_LOAN];
export const ALL_FIELDS = [
  PROPERTY,
  SALARY,
  FORTUNE,
  CURRENT_LOAN,
  WANTED_LOAN,
];
export const CAPPED_FIELDS = [CURRENT_LOAN, WANTED_LOAN];
export const FINAL_STEP = 3;
export const PURCHASE_TYPE = {
  ACQUISITION: 'ACQUISITION',
  REFINANCING: 'REFINANCING',
};
