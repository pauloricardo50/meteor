import { Migrations } from 'meteor/percolate:migrations';

import BorrowerService from '../../borrowers/server/BorrowerService';

export const up = () => {
  const borrowers = BorrowerService.fetch({
    $filters: { bankFortune: { $exists: true } },
    bankFortune: 1,
  });

  return Promise.all(
    borrowers.map(({ _id, bankFortune }) =>
      BorrowerService.rawCollection.update(
        { _id },
        { $set: { bankFortune: [{ value: bankFortune, description: '' }] } },
      ),
    ),
  );
};

export const down = () => {
  const borrowers = BorrowerService.fetch({
    $filters: { bankFortune: { $exists: true, $not: { $size: 0 } } },
    bankFortune: 1,
  });

  return Promise.all(
    borrowers.map(({ _id, bankFortune = [] }) =>
      BorrowerService.rawCollection.update(
        { _id },
        {
          $set: {
            bankFortune: bankFortune.reduce(
              (total, { value = 0 }) => total + value,
              0,
            ),
          },
        },
      ),
    ),
  );
};

Migrations.add({
  version: 29,
  name: 'Make bankFortune an array',
  up,
  down,
});
