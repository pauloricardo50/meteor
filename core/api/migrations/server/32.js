import { Migrations } from 'meteor/percolate:migrations';

import RevenueService from '../../revenues/server/RevenueService';

export const up = () => {
  const revenues = RevenueService.fetch({
    loan: { userCache: 1 },
  });

  return Promise.all(
    revenues.map(({ _id, loan }) => {
      if (
        loan &&
        loan.userCache &&
        loan.userCache.assignedEmployeeCache &&
        loan.userCache.assignedEmployeeCache._id
      ) {
        return RevenueService.rawCollection.update(
          { _id },
          {
            $set: {
              assigneeLink: [{ _id: loan.userCache.assignedEmployeeCache._id }],
            },
          },
        );
      }

      return Promise.resolve();
    }),
  );
};

export const down = () =>
  RevenueService.rawCollection.update(
    {},
    { $unset: { assigneeLink: true } },
    { multi: true },
  );

Migrations.add({
  version: 32,
  name: 'Add a default assignee on each revenue',
  up,
  down,
});
