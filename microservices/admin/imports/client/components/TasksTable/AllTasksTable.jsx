import { Meteor } from 'meteor/meteor';

import { compose, withState } from 'recompose';

import { tasks as query } from 'core/api/tasks/queries';
import { withSmartQuery } from 'core/api';
import { TASK_STATUS } from 'core/api/constants';
import TasksTable from './TasksTable';

export const withTasksQuery = compose(
  withState('assignee', 'setAssignee', { $in: [Meteor.userId(), undefined] }),
  withState('status', 'setStatus', { $in: [TASK_STATUS.ACTIVE] }),
  withSmartQuery({
    query,
    params: ({ assignee, status }) => ({ assignee, status }),
    queryOptions: { reactive: false },
    dataName: 'tasks',
  }),
);

export default compose(withTasksQuery)(TasksTable);
