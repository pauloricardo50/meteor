import { Migrations } from 'meteor/percolate:migrations';

import { Loans, Borrowers, Properties } from '..';
import { MIGRATIONS } from './migrationConstants';
import { STEP_ORDER } from '../loans/loanConstants';

Migrations.add({
  version: MIGRATIONS['1.2.1'],
  name: 'Change loan.logic.step from number to a string',
  up: () => {
    Loans.find({}).forEach((loan) => {
      Loans.update(loan._id, {
        $set: { 'logic.step': STEP_ORDER[loan.logic.step - 1] },
      });
    });

    Borrowers.find({}).forEach((borrower) => {
      Borrowers.update(borrower._id, { $set: { additionalDocuments: [] } });
    });

    Properties.find({}).forEach((property) => {
      Properties.update(property._id, { $set: { additionalDocuments: [] } });
    });
  },
  down: () => {
    Loans.find({}).forEach((loan) => {
      Loans.update(loan._id, {
        $set: { 'logic.step': STEP_ORDER.indexOf([loan.logic.step]) + 1 },
      });
    });

    Borrowers.find({}).forEach((borrower) => {
      Borrowers.update(borrower._id, { $unset: { additionalDocuments: true } });
    });

    Properties.find({}).forEach((property) => {
      Properties.update(property._id, {
        $unset: { additionalDocuments: true },
      });
    });
  },
});
