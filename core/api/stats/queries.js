import Loans from '../loans';
import Users from '../users';

export const newLoans = Loans.createQuery('newLoans', () => {});
export const loanHistogram = Loans.createQuery('loanHistogram', () => {});
export const loansWithoutRevenues = Loans.createQuery(
  'loansWithoutRevenues',
  () => {},
);
export const newUsers = Users.createQuery('newUsers', () => {});
export const userHistogram = Users.createQuery('userHistogram', () => {});
