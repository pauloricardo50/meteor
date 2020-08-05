import Loans from '../loans';

export const newLoans = Loans.createQuery('newLoans', () => {});
export const loanHistogram = Loans.createQuery('loanHistogram', () => {});
export const loansWithoutRevenues = Loans.createQuery(
  'loansWithoutRevenues',
  () => {},
);
