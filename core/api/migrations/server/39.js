import { Migrations } from 'meteor/percolate:migrations';

import TaskService from '../../tasks/server/TaskService';

export const up = () => {
  const tasks = TaskService.fetch({
    $filters: { status: 'CANCELLED' },
    updatedAt: 1,
  });

  return Promise.all(
    tasks.map(({ _id, updatedAt }) =>
      TaskService.rawCollection.update(
        { _id },
        { $set: { status: 'COMPLETED', completedAt: updatedAt } },
      ),
    ),
  );
};

export const down = () => {};

Migrations.add({
  version: 39,
  name: 'Remove cancelled status on tasks',
  up,
  down,
});
