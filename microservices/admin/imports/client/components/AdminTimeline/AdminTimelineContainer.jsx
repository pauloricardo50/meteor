import React, { useState } from 'react';
import { withProps } from 'recompose';

import {
  ACTIVITIES_COLLECTION,
  ACTIVITY_TYPES,
} from 'core/api/activities/activityConstants';
import { activity as activityFragment } from 'core/api/fragments';
import { INSURANCE_REQUESTS_COLLECTION } from 'core/api/insuranceRequests/insuranceRequestConstants';
import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';
import {
  taskChangeStatus,
  taskComplete,
  taskInsert,
  taskUpdate,
} from 'core/api/tasks/methodDefinitions';
import { TASKS_COLLECTION, TASK_STATUS } from 'core/api/tasks/taskConstants';
import { USERS_COLLECTION } from 'core/api/users/userConstants';
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

const getActivities = ({ activityFilters, queryFilters, type }) =>
  useStaticMeteorData(
    {
      query: ACTIVITIES_COLLECTION,
      params: {
        $filters: {
          ...(activityFilters || queryFilters),
          type: formatType(type),
        },
        ...activityFragment(),
      },
    },
    [activityFilters],
  );

const getTasks = ({ fetchTasks, taskFilters, queryFilters }) =>
  useStaticMeteorData(
    {
      query: fetchTasks && TASKS_COLLECTION,
      params: {
        $filters: {
          ...(taskFilters || queryFilters),
          status: TASK_STATUS.COMPLETED,
        },
        completedAt: 1,
        title: 1,
        loanLink: 1,
        userLink: 1,
        promotionLink: 1,
        organisationLink: 1,
        lenderLink: 1,
        contactLink: 1,
        insuranceRequestLink: 1,
        insuranceLink: 1,
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

const getConversations = ({ fetchConversations, frontTagId }) =>
  useStaticMeteorData(
    {
      query: fetchConversations && 'frontGetTaggedConversations',
      params: { tagId: frontTagId },
      dataName: 'conversations',
      refetchOnMethodCall: false,
    },
    [fetchConversations],
  );

const mergeActivities = ({
  loading,
  activities,
  completedTasks,
  conversations,
}) =>
  loading
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
      ].sort((a, b) => b.date?.getTime() - a.date?.getTime());

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

    const { loading: loadingActivities, data: activities } = getActivities({
      activityFilters,
      queryFilters,
      type,
    });

    const { loading: loadingTasks, data: completedTasks } = getTasks({
      fetchTasks,
      taskFilters,
      queryFilters,
    });

    const {
      loading: loadingConversations,
      data: conversations,
    } = getConversations({ fetchConversations, frontTagId });

    const loading = loadingActivities || loadingTasks || loadingConversations;

    return {
      setType,
      type,
      activities: mergeActivities({
        loading,
        activities,
        completedTasks,
        conversations,
      }),
      fetchTasks,
      setFetchTasks,
      fetchConversations,
      setFetchConversations,
    };
  },
);
