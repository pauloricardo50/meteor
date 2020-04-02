import { Migrations } from 'meteor/percolate:migrations';

import Loans from '../../loans/loans';

export const up = () => {
  Loans.update({}, { $set: { additionalDocuments: [] } }, { multi: true });
};

export const down = () => {
  Loans.update({}, { $unset: { additionalDocuments: true } }, { multi: true });
};

Migrations.add({
  version: 2,
  name: 'Add additional documents to loans',
  up,
  down,
});
