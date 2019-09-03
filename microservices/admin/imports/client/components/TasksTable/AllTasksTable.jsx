import { Meteor } from 'meteor/meteor';

import { compose, withState } from 'recompose';

import { tasks as query } from 'core/api/tasks/queries';
import { withSmartQuery } from 'core/api';
import { TASK_STATUS } from 'core/api/constants';
import TasksTable from './TasksTable';

export const withTasksQuery = compose(
  withState('assignee', 'setAssignee', () => ({
    $in: [Meteor.userId(), undefined],
  })),
  withState('status', 'setStatus', { $in: [TASK_STATUS.ACTIVE] }),
  withState('uptoDate', 'setUptoDate', 'TOMORROW'),
  withSmartQuery({
    query,
    params: ({ assignee, status, uptoDate }) => ({
      assignee,
      status,
      uptoDate,
    }),
    queryOptions: { reactive: false, pollingMs: 5000 },
    dataName: 'tasks',
  }),
);

export default compose(withTasksQuery)(TasksTable);
