import { Migrations } from 'meteor/percolate:migrations';

import { LOAN_CATEGORIES } from '../../loans/loanConstants';
import Loans from '../../loans/loans';

export const up = async () => {
  await Loans.rawCollection().update(
    {},
    { $set: { category: LOAN_CATEGORIES.STANDARD } },
    { multi: true },
  );
};

export const down = async () => {
  await Loans.rawCollection().update(
    {},
    { $unset: { category: true } },
    { multi: true },
  );
};

Migrations.add({
  version: 15,
  name: 'Add loan category',
  up,
  down,
});
