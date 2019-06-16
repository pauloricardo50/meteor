import React from 'react';
import { compose, withProps, withState } from 'recompose';
import moment from 'moment';

import T from 'core/components/Translation';
import StatusLabel from 'core/components/StatusLabel';
import { CollectionIconLink } from 'core/components/IconLink';
import {
  USERS_COLLECTION,
  TASKS_COLLECTION,
  LOANS_COLLECTION,
} from 'core/api/constants';

const formatDateTime = (date, toNow) =>
  (date ? moment(date)[toNow ? 'toNow' : 'fromNow']() : '-');

const getColumnOptions = () => [
  { id: 'relatedTo', label: <T id="TasksTable.relatedTo" /> },
  { id: 'title', label: <T id="TasksTable.title" /> },
  { id: 'status', label: <T id="TasksTable.status" /> },
  { id: 'createdAt', label: <T id="TasksTable.createdAt" /> },
  { id: 'dueAt', label: <T id="TasksTable.dueAt" /> },
  { id: 'completedAt', label: <T id="TasksTable.completedAt" /> },
  { id: 'assignedTo', label: <T id="TasksTable.assignedTo" /> },
];

const makeMapTask = ({ setTaskToModify, setShowDialog }) => (task) => {
  const {
    _id: taskId,
    title,
    status,
    createdAt,
    dueAt,
    completedAt,
    assignee,
    loan = {},
    user = {},
  } = task;

  return {
    id: taskId,
    columns: [
      {
        raw: loan.name || user.name,
        label: (loan.name || user.name) && (
          <CollectionIconLink
            relatedDoc={
              loan.name
                ? { ...loan, collection: LOANS_COLLECTION }
                : { ...user, collection: USERS_COLLECTION }
            }
          />
        ),
      },
      title,
      {
        raw: status,
        label: <StatusLabel status={status} collection={TASKS_COLLECTION} />,
      },
      {
        raw: createdAt && createdAt.getTime(),
        label: formatDateTime(createdAt),
      },
      { raw: dueAt && dueAt.getTime(), label: formatDateTime(dueAt) },
      {
        raw: completedAt && completedAt.getTime(),
        label: formatDateTime(completedAt),
      },
      {
        label:
          assignee && assignee._id ? (
            <CollectionIconLink
              relatedDoc={{ ...assignee, collection: USERS_COLLECTION }}
            />
          ) : null,
        raw: assignee && assignee.name,
      },
    ],
    handleClick: () => {
      setTaskToModify(task);
      setShowDialog(true);
    },
  };
};

export default compose(
  withState('taskToModify', 'setTaskToModify', null),
  withState('showDialog', 'setShowDialog', false),
  withProps(({ tasks = [], setTaskToModify, setShowDialog }) => ({
    rows: tasks.map(makeMapTask({ setTaskToModify, setShowDialog })),
    columnOptions: getColumnOptions(),
  })),
);
