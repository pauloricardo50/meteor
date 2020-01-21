import { Migrations } from 'meteor/percolate:migrations';

import LoanService from '../../loans/server/LoanService';

export const up = () => {
  const loans = LoanService.fetch({
    $filters: { userId: { $exists: true } },
    userCache: 1,
  });

  return Promise.all(
    loans.map(({ _id, userCache }) => {
      if (
        userCache &&
        userCache.assignedEmployeeCache &&
        userCache.assignedEmployeeCache._id
      ) {
        return LoanService.rawCollection.update(
          { _id },
          {
            $set: {
              assigneeLinks: [
                {
                  _id: userCache.assignedEmployeeCache._id,
                  isMain: true,
                  percent: 100,
                },
              ],
            },
          },
        );
      }

      return Promise.resolve();
    }),
  );
};

export const down = () =>
  LoanService.rawCollection.update(
    {},
    { $unset: { assigneeLinks: true } },
    { multi: true },
  );

Migrations.add({
  version: 31,
  name: 'Add a default assignee on each loan',
  up,
  down,
});
