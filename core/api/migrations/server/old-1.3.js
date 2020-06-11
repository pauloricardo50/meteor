import { Migrations } from 'meteor/percolate:migrations';

import Borrowers from '../../borrowers';
import { STEP_ORDER } from '../../loans/loanConstants';
import Loans from '../../loans/loans';
import Properties from '../../properties';
import { MIGRATIONS } from './migrationConstants';

// This is an example of a migration we did
// WARNING: Don't use dot-versions, only integers

Migrations.add({
  version: MIGRATIONS['1.3'],
  name: 'Change loan.logic.step from number to a string',
  up: () => {
    Loans.find({}).forEach(loan => {
      Loans.update(loan._id, {
        $set: { 'logic.step': STEP_ORDER[loan.logic.step - 1] },
      });
    });

    Borrowers.update(
      {},
      { $set: { additionalDocuments: [] } },
      { multi: true },
    );

    Properties.update(
      {},
      { $set: { additionalDocuments: [] } },
      { multi: true },
    );
  },
  down: () => {
    Loans.find({}).forEach(loan => {
      Loans.update(loan._id, {
        $set: { 'logic.step': STEP_ORDER.indexOf([loan.logic.step]) + 1 },
      });
    });

    Borrowers.update(
      {},
      { $unset: { additionalDocuments: true } },
      { multi: true },
    );

    Properties.update(
      {},
      {
        $unset: { additionalDocuments: true },
      },
      { multi: true },
    );
  },
});
