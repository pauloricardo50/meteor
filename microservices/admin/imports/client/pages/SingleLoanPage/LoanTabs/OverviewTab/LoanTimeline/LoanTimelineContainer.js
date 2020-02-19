import React from 'react';
import { compose, withState, mapProps } from 'recompose';

import { withSmartQuery } from 'core/api';
import { adminActivities } from 'core/api/activities/queries';
import { ACTIVITY_TYPES } from 'core/api/activities/activityConstants';
import {
  taskInsert,
  taskUpdate,
  taskChangeStatus,
  taskComplete,
} from 'core/api/methods';
import { TASK_STATUS, TASKS_COLLECTION } from 'core/api/constants';

const formatType = type => {
  if (type.$in && type.$in.includes('COMMUNICATION')) {
    return { $in: [...type.$in, ACTIVITY_TYPES.EMAIL, ACTIVITY_TYPES.PHONE] };
  }
  return type;
};

export const activityFilterOptions = [
  'COMMUNICATION',
  ...Object.values(ACTIVITY_TYPES).filter(
    type => type !== ACTIVITY_TYPES.EMAIL && type !== ACTIVITY_TYPES.PHONE,
  ),
];

export default compose(
  withState('type', 'setType', { $in: activityFilterOptions }),
  withSmartQuery({
    query: adminActivities,
    params: ({ loanId, type }) => ({ loanId, type: formatType(type) }),
    dataName: 'activities',
  }),
  withSmartQuery({
    query: TASKS_COLLECTION,
    params: ({ loanId }) => ({
      $filters: { 'loanLink._id': loanId, status: TASK_STATUS.COMPLETED },
      completedAt: 1,
      title: 1,
    }),
    queryOptions: { reactive: false },
    dataName: 'completedTasks',
    refetchOnMethodCall: [
      taskInsert,
      taskUpdate,
      taskChangeStatus,
      taskComplete,
    ],
  }),
  withSmartQuery({
    query: 'frontGetTaggedConversations',
    params: ({ frontTagId }) => ({ tagId: frontTagId }),
    dataName: 'conversations',
  }),
  mapProps(({ activities, completedTasks, conversations, ...rest }) => ({
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
      ...conversations.map(({ frontLink, ...conversation }) => ({
        ...conversation,
        description: <a href={frontLink}>Ouvrir dans Front</a>,
      })),
    ].sort((a, b) => a.date - b.date),
    ...rest,
  })),
);
