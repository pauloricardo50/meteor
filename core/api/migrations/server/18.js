import { Migrations } from 'meteor/percolate:migrations';

import { TASK_PRIORITIES } from '../../tasks/taskConstants';
import Tasks from '../../tasks/tasks';

export const up = async () => {
  await Tasks.rawCollection().update(
    {},
    { $set: { priority: TASK_PRIORITIES.DEFAULT } },
    { multi: true },
  );
};

export const down = async () => {
  await Tasks.rawCollection().update(
    {},
    { $unset: { priority: true } },
    { multi: true },
  );
};

Migrations.add({
  version: 18,
  name: 'Add task priority',
  up,
  down,
});
