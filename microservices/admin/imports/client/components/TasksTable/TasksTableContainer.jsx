import { Meteor } from 'meteor/meteor';

import React from 'react';
import { compose, withProps } from 'recompose';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import T from 'core/components/Translation';
import StatusLabel from 'core/components/StatusLabel';
import { CollectionIconLink } from 'core/components/IconLink';
import { USERS_COLLECTION } from 'core/api/constants';
import { TASKS_COLLECTION } from 'imports/core/api/constants';
import TaskAssignDropdown from '../AssignAdminDropdown/TaskAssignDropdown';
import TaskStatusSetter from './TaskStatusSetter';

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
  { id: 'actions', label: <T id="TasksTable.actions" /> },
];

const makeMapTask = ({ history }) => (task) => {
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
  console.log('task', task);
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
      formatDateTime(dueAt, true),
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
      {
        raw: status,
        label: (
          <div style={{ display: 'flex' }}>
            <TaskStatusSetter
              currentUser={Meteor.user()}
              taskId={taskId}
              taskStatus={status}
            />
            <TaskAssignDropdown doc={task} />
          </div>
        ),
      },
    ],
    handleClick: () => {
      history.push(`/${collection}/${relatedDocId}`);
    },
  };
};

export default compose(
  withRouter,
  withProps(({ tasks = [], history }) => ({
    rows: tasks.map(makeMapTask({ history })),
    columnOptions: getColumnOptions(),
  })),
);
