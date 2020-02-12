import { withSmartQuery } from 'core/api';
import { compose, shouldUpdate, withState } from 'recompose';

import {
  taskInsert,
  taskUpdate,
  taskChangeStatus,
  taskComplete,
} from 'core/api/methods';
import { TASK_STATUS, TASKS_COLLECTION } from 'core/api/constants';
import { taskTableFragment } from '../../../components/TasksTable/TasksTable';

export default compose(
  shouldUpdate(() => false),
  withState('status', 'setStatus', { $in: [TASK_STATUS.ACTIVE] }),
  withSmartQuery({
    query: TASKS_COLLECTION,
    params: ({ organisationId, status }) => ({
      $filters: { 'organisationLink._id': organisationId, status },
      ...taskTableFragment,
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
