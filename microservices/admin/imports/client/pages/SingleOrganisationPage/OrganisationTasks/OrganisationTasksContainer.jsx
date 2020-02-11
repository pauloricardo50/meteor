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
  shouldUpdate(() => false),
  withState('status', 'setStatus', { $in: [TASK_STATUS.ACTIVE] }),
  withSmartQuery({
    query: tasks,
    params: ({ organisationId, status }) => ({
      organisationId,
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
