import { Migrations } from 'meteor/percolate:migrations';

import { Loans } from '../..';
import { LOAN_CATEGORIES } from '../../loans/loanConstants';

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
