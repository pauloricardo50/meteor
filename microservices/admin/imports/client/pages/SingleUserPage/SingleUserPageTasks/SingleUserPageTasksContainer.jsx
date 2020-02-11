import { withSmartQuery } from 'core/api';
import { compose, shouldUpdate, withState } from 'recompose';
import {
  taskInsert,
  taskUpdate,
  taskChangeStatus,
  taskComplete,
} from 'core/api/methods';
import { tasks } from 'core/api/tasks/queries';
import { TASK_STATUS } from 'core/api/constants';

export default compose(
  // This component is self-contained, shouldn't need to update
  // If tasks are added to new borrowers or properties, a refresh will do
  shouldUpdate(() => false),
  withState('status', 'setStatus', { $in: [TASK_STATUS.ACTIVE] }),
  withSmartQuery({
    query: tasks,
    params: ({ user: { _id: userId }, assignee, status }) => ({
      userId,
      assignee,
      status,
    }),
    queryOptions: { reactive: false },
    dataName: 'tasks',
    refetchOnMethodCall: [
      taskInsert,
      taskUpdate,
      taskChangeStatus,
      taskComplete,
    ],
  }),
);
