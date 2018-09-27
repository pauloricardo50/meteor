import { Migrations } from 'meteor/percolate:migrations';

import { Loans } from '..';
import { MIGRATIONS } from './migrationConstants';
import { LOAN_STATUS } from '../loans/loanConstants';

Migrations.add({
  version: MIGRATIONS['1'],
  name: 'Change loan status to new value',
  up: () => {
    Loans.update({}, { $set: { status: LOAN_STATUS.LEAD } }, { multi: true });
  },
  down: () => {
    Loans.update({}, { $unset: { status: true } }, { multi: true });
  },
});
