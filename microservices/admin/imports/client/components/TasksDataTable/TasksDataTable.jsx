import React, { useCallback } from 'react';

import { TASKS_COLLECTION } from 'core/api/tasks/taskConstants';
import DataTable from 'core/components/DataTable/DataTable';
import { CollectionIconLink } from 'core/components/IconLink';
import Linkify from 'core/components/Linkify';
import T, { IntlDate } from 'core/components/Translation';

import {
  formatDateTime,
  getTasksTableModalProps,
} from './tasksDataTableHelpers';
import TasksTableActions from './TasksTableActions';

export const taskTableFragment = {
  assigneeLink: 1,
  assignee: { name: 1, roles: 1 },
  createdAt: 1,
  createdBy: 1,
  description: 1,
  dueAt: 1,
  lender: { organisation: { name: 1 } },
  loan: { name: 1, borrowers: { name: 1 }, user: { name: 1 } },
  organisation: { name: 1 },
  priority: 1,
  promotion: { name: 1 },
  status: 1,
  title: 1,
  user: { name: 1, roles: 1, organisations: { name: 1 } },
  insuranceRequest: { name: 1 },
  insurance: { name: 1, insuranceRequest: { _id: 1 } },
  isPrivate: 1,
};

const getRelatedTo = task =>
  task.loan ||
  task.user ||
  task.promotion ||
  task.organisation ||
  task.lender ||
  task.insuranceRequest ||
  task.insurance;

const TasksDataTable = ({ showRelatedTo, filters, ...rest }) => {
  const getModalProps = useCallback(row => getTasksTableModalProps(row), []);

  return (
    <>
      <DataTable
        className="tasks-data-table"
        queryConfig={{
          query: TASKS_COLLECTION,
          params: { $filters: filters, ...taskTableFragment },
        }}
        queryDeps={[filters]}
        columns={[
          {
            accessor: 'relatedTo',
            Header: <T id="TasksTable.relatedTo" />,
            style: { width: 200 },
            disableSortBy: true,
            Cell: ({ row: { original: task } }) => (
              <CollectionIconLink
                relatedDoc={getRelatedTo(task)}
                variant="TASKS_TABLE"
              />
            ),
          },
          {
            accessor: 'title',
            Header: <T id="TasksTable.title" />,
            style: { width: '100%' },
            Cell: ({ value }) => <b>{value}</b>,
          },
          {
            accessor: 'description',
            Header: <T id="TasksTable.description" />,
            style: { width: '200%' },
            Cell: ({ value = '-' }) => (
              <Linkify style={{ whiteSpace: 'pre-wrap' }}>{value}</Linkify>
            ),
          },
          {
            accessor: 'createdAt',
            Header: <T id="TasksTable.createdAt" />,
            style: { width: 100 },
            Cell: ({ value }) => <IntlDate value={value} type="relative" />,
          },
          {
            accessor: 'dueAt',
            Header: <T id="TasksTable.dueAt" />,
            style: { width: 100 },
            Cell: ({ value }) => formatDateTime(value),
          },
          {
            accessor: 'assigneeLink._id',
            Header: <T id="TasksTable.assignedTo" />,
            style: { width: 60 },
            disableSortBy: true,
            Cell: ({
              row: {
                original: { assignee },
              },
            }) => <CollectionIconLink relatedDoc={assignee} />,
          },
          {
            accessor: '_id',
            Header: 'Actions',
            style: { width: 96 },
            disableSortBy: true,
            Cell: ({ value, row: { original } }) => (
              <TasksTableActions taskId={value} priority={original.priority} />
            ),
          },
        ]}
        initialHiddenColumns={[!showRelatedTo && 'relatedTo'].filter(x => x)}
        initialSort={{ id: 'dueAt', desc: true }}
        modalType="form"
        getModalProps={getModalProps}
        {...rest}
      />
    </>
  );
};
export default TasksDataTable;
