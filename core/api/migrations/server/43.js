import { Migrations } from 'meteor/percolate:migrations';

import BorrowerService from '../../borrowers/server/BorrowerService';

export const up = () => {
  const borrowers = BorrowerService.fetch({
    $filters: { childrenCount: { $exists: true } },
    childrenCount: 1,
  });

  return Promise.all(
    borrowers.map(({ _id, childrenCount }) =>
      BorrowerService.rawCollection.update(
        { _id },
        {
          $set: {
            children: [...Array(childrenCount)].map((_, index) => ({
              name: `Enfant ${index + 1}`,
            })),
          },
          $unset: { childrenCount: 1 },
        },
      ),
    ),
  );
};

export const down = () => {
  const borrowers = BorrowerService.fetch({
    $filters: { children: { $exists: true, $not: { $size: 0 } } },
    children: 1,
  });

  return Promise.all(
    borrowers.map(({ _id, children = [] }) =>
      BorrowerService.rawCollection.update(
        { _id },
        { $set: { childrenCount: children.length }, $unset: { children: 1 } },
      ),
    ),
  );
};

Migrations.add({
  version: 43,
  name: 'Migrate borrower children to an array',
  up,
  down,
});
