import Activites from '../activities';
import Loans from '../loans';

export const loanMonitoring = Loans.createQuery('loanMonitoring', () => {});

export const collectionStatusChanges = Activites.createQuery(
  'collectionStatusChanges',
  () => {},
);
