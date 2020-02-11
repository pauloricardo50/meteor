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
  // This component is self-contained, shouldn't need to update
  // If tasks are added to new borrowers or properties, a refresh will do
  shouldUpdate(() => false),
  withState('status', 'setStatus', { $in: [TASK_STATUS.ACTIVE] }),
  withSmartQuery({
    query: TASKS_COLLECTION,
    params: ({ loan: { _id: loanId }, assignee, status }) => ({
      $filters: {
        'loanLink._id': loanId,
        'assigneeLink._id': assignee,
        status,
      },
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
