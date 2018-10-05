// @flow
import React from 'react';

import { TASK_STATUS } from 'core/api/tasks/taskConstants';
import LoanTaskInserter from '../LoanTaskInserter';
import TasksTable from '../../../components/TasksTable/TasksTable';
import SingleLoanPageTasksContainer from './SingleLoanPageTasksContainer';

type SingleLoanPageTasksProps = {};

const SingleLoanPageTasks = ({
  loan,
  refetch,
  ...rest
}: SingleLoanPageTasksProps) => (
  <div className="card1 card-top single-loan-page-tasks">
    <h3>Tâches</h3>
    <LoanTaskInserter loanId={loan._id} refetch={refetch} />
    <TasksTable
      showAssignee
      loanId={loan._id}
      propertyIds={loan.properties.map(({ _id }) => _id)}
      borrowerIds={loan.borrowers.map(({ _id }) => _id)}
      hideIfNoData
      tableFilters={{
        filters: { status: [TASK_STATUS.ACTIVE] },
        options: { status: Object.values(TASK_STATUS) },
      }}
      {...rest}
    />
  </div>
);

export default SingleLoanPageTasksContainer(SingleLoanPageTasks);
