import { useState } from 'react';
import { withSmartQuery } from 'core/api';
import { compose, shouldUpdate, withState, withProps } from 'recompose';
import {
  taskInsert,
  taskUpdate,
  taskChangeStatus,
  taskComplete,
} from 'core/api/methods';
import { TASK_STATUS, TASKS_COLLECTION } from 'core/api/constants';
import useSearchParams from 'core/hooks/useSearchParams';
import { taskTableFragment } from '../../../components/TasksTable/TasksTable';

export default compose(
  shouldUpdate(() => false),
  withState('status', 'setStatus', { $in: [TASK_STATUS.ACTIVE] }),
  withSmartQuery({
    query: TASKS_COLLECTION,
    params: ({ user: { _id: userId }, assignee, status }) => ({
      $filters: {
        'userLink._id': userId,
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
  withProps(() => {
    const initialSearchParams = useSearchParams();
    const [searchParams, setSearchParams] = useState(initialSearchParams);
    return {
      model: searchParams,
      openOnMount:
        searchParams.addTask &&
        !!Object.keys(searchParams).filter(key =>
          ['title', 'description'].includes(key),
        ).length,
      resetForm: () => setSearchParams({}),
    };
  }),
);
