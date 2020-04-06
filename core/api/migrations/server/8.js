import { Migrations } from 'meteor/percolate:migrations';

import { APPLICATION_TYPES } from 'core/api/loans/loanConstants';

import Loans from '../../loans/loans';

export const up = () => {
  const allLoans = Loans.find({}).fetch();

  return Promise.all(
    allLoans.map(({ _id }) =>
      Loans.rawCollection().update(
        { _id },
        { $set: { applicationType: APPLICATION_TYPES.FULL } },
      ),
    ),
  );
};

export const down = () => {
  const allLoans = Loans.find({}).fetch();

  return Promise.all(
    allLoans.map(({ _id }) =>
      Loans.rawCollection().update(
        { _id },
        { $unset: { applicationType: true } },
      ),
    ),
  );
};

Migrations.add({
  version: 8,
  name: 'Add applicationType on loans',
  up,
  down,
});
