import React, { useState } from 'react';
import { compose, withState, withProps } from 'recompose';

import { adminActivities } from 'core/api/activities/queries';
import { ACTIVITY_TYPES } from 'core/api/activities/activityConstants';
import {
  taskInsert,
  taskUpdate,
  taskChangeStatus,
  taskComplete,
} from 'core/api/methods';
import { TASK_STATUS, TASKS_COLLECTION } from 'core/api/constants';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';

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
  withProps(({ loanId, type, frontTagId }) => {
    const [fetchTasks, setFetchTasks] = useState(false);
    const [fetchConversations, setFetchConversations] = useState(true);

    const {
      loading: loadingActivities,
      data: activities,
    } = useStaticMeteorData({
      query: adminActivities,
      params: { loanId, type: formatType(type) },
      refetchOnMethodCall: false,
    });

    const { loading: loadingTasks, data: completedTasks } = useStaticMeteorData(
      {
        query: fetchTasks && TASKS_COLLECTION,
        params: {
          $filters: { 'loanLink._id': loanId, status: TASK_STATUS.COMPLETED },
          completedAt: 1,
          title: 1,
        },
        refetchOnMethodCall: [
          taskInsert,
          taskUpdate,
          taskChangeStatus,
          taskComplete,
        ],
      },
      [fetchTasks],
    );

    const {
      loading: loadingConversations,
      data: conversations,
    } = useStaticMeteorData(
      {
        query: fetchConversations && 'frontGetTaggedConversations',
        params: { tagId: frontTagId },
        dataName: 'conversations',
        refetchOnMethodCall: false,
      },
      [fetchConversations],
    );

    const loading = loadingActivities || loadingTasks || loadingConversations;

    return {
      activities: loading
        ? []
        : [
            ...(activities || []),
            ...(completedTasks
              ? completedTasks
                  .filter(({ completedAt }) => !!completedAt)
                  .map(({ completedAt, title }) => ({
                    date: completedAt,
                    title: 'Tâche complétée',
                    type: 'task',
                    description: title,
                  }))
              : []),
            ...(conversations
              ? conversations.map(({ frontLink, ...conversation }) => ({
                  ...conversation,
                  description: <a href={frontLink}>Ouvrir dans Front</a>,
                }))
              : []),
          ].sort((a, b) => a.date - b.date),
      fetchTasks,
      setFetchTasks,
      fetchConversations,
      setFetchConversations,
    };
  }),
);
