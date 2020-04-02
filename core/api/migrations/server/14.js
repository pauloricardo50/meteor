import { Migrations } from 'meteor/percolate:migrations';

import Properties from '../../properties/index';

export const up = () => {
  const allProperties = Properties.find({}).fetch();

  return Promise.all(
    allProperties.map(({ _id, monthlyExpenses }) =>
      Properties.rawCollection().update(
        { _id },
        {
          ...(monthlyExpenses
            ? { $set: { yearlyExpenses: monthlyExpenses * 12 } }
            : {}),
          $unset: { monthlyExpenses: true },
        },
      ),
    ),
  );
};

export const down = () => {
  const allProperties = Properties.find({}).fetch();

  return Promise.all(
    allProperties.map(({ _id, yearlyExpenses }) =>
      Properties.rawCollection().update(
        { _id },
        {
          ...(yearlyExpenses
            ? { $set: { monthlyExpenses: Math.round(yearlyExpenses / 12) } }
            : {}),
          $unset: { yearlyExpenses: true },
        },
      ),
    ),
  );
};

Migrations.add({
  version: 14,
  name: 'Change monthlyExpenses into yearlyExpenses',
  up,
  down,
});
