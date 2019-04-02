import { Migrations } from 'meteor/percolate:migrations';

import { Loans } from '../..';

export const up = () => {
  const allLoans = Loans.find({}).fetch();

  return Promise.all(allLoans.map(({ _id, logic: { step } }) =>
    Loans.rawCollection().update(
      { _id },
      { $set: { step }, $unset: { logic: true } },
    )));
};

export const down = () => {
  const allLoans = Loans.find({}).fetch();

  return Promise.all(allLoans.map(({ _id, step }) =>
    Loans.rawCollection().update(
      { _id },
      { $set: { logic: { step } }, $unset: { step: true } },
    )));
};

Migrations.add({
  version: 7,
  name: 'Remove loan.logic',
  up,
  down,
});
