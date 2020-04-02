import React from 'react';
import moment from 'moment';
import { compose, withProps, withState } from 'recompose';

import T from 'core/components/Translation';
import StatusLabel from 'core/components/StatusLabel';
import { CollectionIconLink } from 'core/components/IconLink';
import { ORDER } from 'core/utils/sortArrayOfObjects';
import Linkify from 'core/components/Linkify';
import { employeesById } from 'core/arrays/epotekEmployees';
import { USERS_COLLECTION } from 'core/api/users/userConstants';
import { TASKS_COLLECTION } from 'core/api/tasks/taskConstants';
import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';
import { PROMOTIONS_COLLECTION } from 'core/api/promotions/promotionConstants';
import { ORGANISATIONS_COLLECTION } from 'core/api/organisations/organisationConstants';
import { LENDERS_COLLECTION } from 'core/api/lenders/lenderConstants';
import { INSURANCE_REQUESTS_COLLECTION } from 'core/api/insuranceRequests/insuranceRequestConstants';
import { INSURANCES_COLLECTION } from 'core/api/insurances/insuranceConstants';

import TasksTableActions from './TasksTableActions';

const now = moment();
export const formatDateTime = (date, toNow) => {
  const momentDate = moment(date);
  const text = date ? momentDate[toNow ? 'toNow' : 'fromNow']() : '-';

  if (momentDate.isBefore(now)) {
    return <span className="error-box">{text}</span>;
  }

  return text;
};

const getColumnOptions = ({ relatedTo = true, showStatusColumn }) =>
  [
    relatedTo && {
      id: 'relatedTo',
      label: <T id="TasksTable.relatedTo" />,
      style: { width: 200 },
    },
    {
      id: 'title',
      label: <T id="TasksTable.title" />,
      style: { width: '100%' },
    },
    {
      id: 'description',
      label: <T id="TasksTable.description" />,
      style: { width: '200%' },
    },
    showStatusColumn && {
      id: 'status',
      label: <T id="TasksTable.status" />,
      style: { width: 70 },
    },
    {
      id: 'createdAt',
      label: <T id="TasksTable.createdAt" />,
      style: { width: 100 },
    },
    { id: 'dueAt', label: <T id="TasksTable.dueAt" />, style: { width: 100 } },
    {
      id: 'assignedTo',
      label: <T id="TasksTable.assignedTo" />,
      style: { width: 60 },
    },
    { id: 'actions', label: 'Actions', style: { width: 96 } },
  ].filter(x => x);

const getRelatedDoc = ({
  user,
  loan,
  promotion,
  organisation,
  lender,
  insuranceRequest,
  insurance,
}) => {
  if (user) {
    return { ...user, collection: USERS_COLLECTION };
  }

  if (loan) {
    return { ...loan, collection: LOANS_COLLECTION };
  }

  if (promotion) {
    return { ...promotion, collection: PROMOTIONS_COLLECTION };
  }

  if (organisation) {
    return { ...organisation, collection: ORGANISATIONS_COLLECTION };
  }

  if (lender) {
    return { ...lender, collection: LENDERS_COLLECTION };
  }

  if (insurance) {
    return { ...insurance, collection: INSURANCES_COLLECTION };
  }

  if (insuranceRequest) {
    return { ...insuranceRequest, collection: INSURANCE_REQUESTS_COLLECTION };
  }
};

const makeMapTask = ({
  setTaskToModify,
  setShowDialog,
  relatedTo = true,
  showStatusColumn,
}) => task => {
  const {
    _id: taskId,
    title,
    description,
    status,
    dueAt,
    assignee,
    loan,
    user,
    promotion,
    organisation,
    lender,
    priority,
    createdAt,
    createdBy,
    insuranceRequest,
    insurance,
  } = task;

  const createdByFirstName =
    createdBy && employeesById[createdBy]?.name.split(' ')[0];

  const assigneeCreatedTask = assignee?._id === createdBy;

  const createdByLabel =
    createdByFirstName && !assigneeCreatedTask
      ? ` par ${createdByFirstName}`
      : '';
  const createdAtLabel = moment(createdAt).fromNow();

  const selectedRelatedTo =
    loan ||
    user ||
    promotion ||
    organisation ||
    lender ||
    insuranceRequest ||
    insurance;

  return {
    id: taskId,
    priority,
    columns: [
      relatedTo && {
        raw: selectedRelatedTo,
        label: selectedRelatedTo && (
          <CollectionIconLink
            relatedDoc={getRelatedDoc(task)}
            variant="TASKS_TABLE"
          />
        ),
      },
      { raw: title || '-', label: <b>{title}</b> },
      {
        raw: description || '-',
        label: (
          <Linkify>
            <div style={{ whiteSpace: 'pre-wrap' }}>{description || '-'}</div>
          </Linkify>
        ),
      },
      showStatusColumn && {
        raw: status,
        label: <StatusLabel status={status} collection={TASKS_COLLECTION} />,
      },
      {
        raw: createdAt && createdAt.getTime(),
        label: `${createdAtLabel}${createdByLabel}`,
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
      {
        raw: '',
        label: <TasksTableActions taskId={taskId} priority={priority} />,
      },
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
    let stat;
    // Only show the status column if necessary
    const showStatusColumn =
      tasks.length > 1 &&
      !tasks.every(({ status }) => {
        if (!stat) {
          stat = status;
        }

        return status === stat;
      });

    const columnOptions = getColumnOptions({ relatedTo, showStatusColumn });
    return {
      rows: tasks.map(
        makeMapTask({
          setTaskToModify,
          setShowDialog,
          relatedTo,
          showStatusColumn,
        }),
      ),
      columnOptions,
      initialOrderBy: 'dueAt',
      initialOrder: ORDER.ASC,
    };
  }),
);
