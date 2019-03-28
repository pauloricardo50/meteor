// @flow
import React from 'react';

import { TASK_STATUS } from 'core/api/tasks/taskConstants';
import LoanTaskInserter from './LoanTaskInserter';
import TasksTable from '../../../components/TasksTable';
import SingleLoanPageTasksContainer from './SingleLoanPageTasksContainer';

type SingleLoanPageTasksProps = {};

const SingleLoanPageTasks = ({
  loan,
  refetch,
  tasks,
  ...rest
}: SingleLoanPageTasksProps) => (
  <div className="card1 card-top single-loan-page-tasks">
    <div className="flex">
      <h3>Tâches</h3>
      <LoanTaskInserter loan={loan} refetch={refetch} />
    </div>
    {tasks && !!tasks.length && (
      <TasksTable
        tableFilters={{
          filters: { status: [TASK_STATUS.ACTIVE] },
          options: { status: Object.values(TASK_STATUS) },
        }}
        tasks={tasks}
      />
    )}
  </div>
);

export default SingleLoanPageTasksContainer(SingleLoanPageTasks);
