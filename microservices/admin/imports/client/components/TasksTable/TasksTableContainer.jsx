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
import { ORDER } from 'core/utils/sortArrayOfObjects';
import TasksTableActions from './TasksTableActions';

const now = moment();
const formatDateTime = (date, toNow) => {
  const momentDate = moment(date);
  const text = date ? momentDate[toNow ? 'toNow' : 'fromNow']() : '-';

  if (momentDate.isBefore(now)) {
    return <span className="error-box">{text}</span>;
  }

  return text;
};

const getColumnOptions = (relatedTo = true) =>
  [
    relatedTo && { id: 'relatedTo', label: <T id="TasksTable.relatedTo" /> },
    { id: 'title', label: <T id="TasksTable.title" /> },
    { id: 'description', label: <T id="TasksTable.description" /> },
    { id: 'status', label: <T id="TasksTable.status" /> },
    { id: 'dueAt', label: <T id="TasksTable.dueAt" /> },
    { id: 'assignedTo', label: <T id="TasksTable.assignedTo" /> },
    { id: 'actions', label: 'Actions' },
  ].filter(x => x);

const makeMapTask = ({
  setTaskToModify,
  setShowDialog,
  relatedTo = true,
}) => (task) => {
  const {
    _id: taskId,
    title,
    description,
    status,
    dueAt,
    completedAt,
    assignee,
    loan = {},
    user = {},
  } = task;

  return {
    id: taskId,
    columns: [
      relatedTo && {
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
      title || '-',
      description || '-',
      {
        raw: status,
        label: <StatusLabel status={status} collection={TASKS_COLLECTION} />,
      },
      { raw: dueAt && dueAt.getTime(), label: formatDateTime(dueAt) },
      {
        label:
          assignee && assignee._id ? (
            <CollectionIconLink
              relatedDoc={{ ...assignee, collection: USERS_COLLECTION }}
            />
          ) : null,
        raw: assignee && assignee.name,
      },
      { raw: '', label: <TasksTableActions taskId={taskId} /> },
    ].filter(x => x),
    handleClick: () => {
      setTaskToModify(task);
      setShowDialog(true);
    },
  };
};

export default compose(
  withState('taskToModify', 'setTaskToModify', null),
  withState('showDialog', 'setShowDialog', false),
  withProps(({ tasks = [], setTaskToModify, setShowDialog, relatedTo }) => {
    const columnOptions = getColumnOptions(relatedTo);
    return {
      rows: tasks.map(makeMapTask({ setTaskToModify, setShowDialog, relatedTo })),
      columnOptions,
      initialOrderBy: columnOptions.findIndex(({ id }) => id === 'dueAt'),
      initialOrder: ORDER.ASC,
    };
  }),
);
