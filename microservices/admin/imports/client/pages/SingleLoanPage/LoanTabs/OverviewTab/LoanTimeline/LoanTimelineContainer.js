import { compose, withState, mapProps } from 'recompose';

import { withSmartQuery } from 'core/api';
import { adminActivities } from 'core/api/activities/queries';
import { tasks } from 'core/api/tasks/queries';
import { ACTIVITY_TYPES } from 'core/api/activities/activityConstants';
import {
  taskInsert,
  taskUpdate,
  taskChangeStatus,
  taskComplete,
} from 'core/api/methods';
import { TASK_STATUS } from 'core/api/constants';

const formatType = (type) => {
  if (type.$in && type.$in.includes('COMMUNICATION')) {
    return { $in: [...type.$in, ACTIVITY_TYPES.EMAIL, ACTIVITY_TYPES.PHONE] };
  }
  return type;
};

export const activityFilterOtions = [
  'COMMUNICATION',
  ...Object.values(ACTIVITY_TYPES).filter(type => type !== ACTIVITY_TYPES.EMAIL && type !== ACTIVITY_TYPES.PHONE),
];

export default compose(
  withState('type', 'setType', { $in: activityFilterOtions }),
  withSmartQuery({
    query: adminActivities,
    params: ({ loanId, type }) => ({ loanId, type: formatType(type) }),
    dataName: 'activities',
  }),
  withSmartQuery({
    query: tasks,
    params: ({ loanId }) => ({ loanId, status: TASK_STATUS.COMPLETED }),
    queryOptions: { reactive: false },
    dataName: 'completedTasks',
    refetchOnMethodCall: [
      taskInsert,
      taskUpdate,
      taskChangeStatus,
      taskComplete,
    ],
  }),
  mapProps(({ activities, completedTasks, ...rest }) => ({
    activities: [
      ...activities,
      ...completedTasks
        .filter(({ completedAt }) => !!completedAt)
        .map(({ completedAt, title }) => ({
          date: completedAt,
          title: 'Tâche complétée',
          type: 'task',
          description: title,
        })),
    ].sort((a, b) => a.date - b.date),
    ...rest,
  })),
);
