import React from 'react';
import { compose, withProps, withState } from 'recompose';
import moment from 'moment';

import T from 'core/components/Translation';
import StatusLabel from 'core/components/StatusLabel';
import { CollectionIconLink } from 'core/components/IconLink';
import { USERS_COLLECTION } from 'core/api/constants';
import { TASKS_COLLECTION } from 'imports/core/api/constants';

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
    type,
    relatedDoc,
    status,
    createdAt,
    dueAt,
    completedAt,
    assignedEmployee,
  } = task;
  const { collection, _id: relatedDocId } = relatedDoc;

  return {
    id: taskId,
    columns: [
      {
        raw: collection,
        label: collection && <CollectionIconLink relatedDoc={relatedDoc} />,
      },
      title || {
        raw: type,
        label: <T id={`TaskStatusSetter.${type}`} />,
      },
      {
        raw: status,
        label: <StatusLabel status={status} collection={TASKS_COLLECTION} />,
      },
      formatDateTime(createdAt),
      formatDateTime(dueAt),
      formatDateTime(completedAt),
      {
        label:
          assignedEmployee && assignedEmployee._id ? (
            <CollectionIconLink
              relatedDoc={{ ...assignedEmployee, collection: USERS_COLLECTION }}
            />
          ) : null,
        raw: assignedEmployee && assignedEmployee.name,
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
