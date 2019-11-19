import Loans from '../loans';

export const loanMonitoring = Loans.createQuery('loanMonitoring', () => {});
export const loanStatusChanges = Loans.createQuery(
  'loanStatusChanges',
  () => {},
);
