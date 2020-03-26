import React, { useState } from 'react';
import { withProps } from 'recompose';
import {
  ACTIVITY_TYPES,
  ACTIVITIES_COLLECTION,
} from 'core/api/activities/activityConstants';
import {
  USERS_COLLECTION,
  LOANS_COLLECTION,
  INSURANCE_REQUESTS_COLLECTION,
  TASKS_COLLECTION,
  TASK_STATUS,
} from 'core/api/constants';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';
import {
  taskInsert,
  taskUpdate,
  taskChangeStatus,
  taskComplete,
  activityInsert,
  activityUpdate,
} from 'core/api/methods';
import { activity as activityFragment } from 'core/api/fragments';

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

export default withProps(
  ({ docId, collection, frontTagId, taskFilters, activityFilters }) => {
    const [type, setType] = useState({ $in: activityFilterOptions });
    const [fetchTasks, setFetchTasks] = useState(false);
    const [fetchConversations, setFetchConversations] = useState(true);

    let queryFilters = {};

    switch (collection) {
      case LOANS_COLLECTION:
        queryFilters = { 'loanLink._id': docId };
        break;
      case USERS_COLLECTION:
        queryFilters = { 'userLink._id': docId };
        break;
      case INSURANCE_REQUESTS_COLLECTION:
        queryFilters = { 'insuranceRequestLink._id': docId };
        break;
      default:
        break;
    }

    const {
      loading: loadingActivities,
      data: activities,
    } = useStaticMeteorData(
      {
        query: ACTIVITIES_COLLECTION,
        params: {
          $filters: {
            ...(activityFilters || queryFilters),
            type: formatType(type),
          },
          ...activityFragment(),
        },
        refetchOnMethodCall: [activityInsert, activityUpdate],
      },
      [activityFilters],
    );

    const { loading: loadingTasks, data: completedTasks } = useStaticMeteorData(
      {
        query: fetchTasks && TASKS_COLLECTION,
        params: {
          $filters: {
            ...(taskFilters || queryFilters),
            status: TASK_STATUS.COMPLETED,
          },
          completedAt: 1,
          title: 1,
          loanLink: { _id: 1 },
          userLink: { _id: 1 },
          promotionLink: { _id: 1 },
          organisationLink: { _id: 1 },
          lenderLink: { _id: 1 },
          contactLink: { _id: 1 },
          insuranceRequestLink: { _id: 1 },
          insuranceLink: { _id: 1 },
        },
        refetchOnMethodCall: [
          taskInsert,
          taskUpdate,
          taskChangeStatus,
          taskComplete,
        ],
      },
      [fetchTasks, taskFilters],
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
      setType,
      type,
      activities: loading
        ? []
        : [
            ...(activities || []),
            ...(completedTasks
              ? completedTasks
                  .filter(({ completedAt }) => !!completedAt)
                  .map(({ completedAt, title, ...task }) => ({
                    date: completedAt,
                    title: 'Tâche complétée',
                    type: 'task',
                    description: title,
                    ...task,
                  }))
              : []),
            ...(conversations
              ? conversations.map(({ frontLink, ...conversation }) => ({
                  ...conversation,
                  description: <a href={frontLink}>Ouvrir dans Front</a>,
                }))
              : []),
          ].sort((a, b) => a.date?.getTime() - b.date?.getTime()),
      fetchTasks,
      setFetchTasks,
      fetchConversations,
      setFetchConversations,
    };
  },
);
