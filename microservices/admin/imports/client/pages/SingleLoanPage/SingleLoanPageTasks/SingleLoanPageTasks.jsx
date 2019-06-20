// @flow
import React from 'react';

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
    {tasks && !!tasks.length && <TasksTable tasks={tasks} relatedTo={false} />}
  </div>
);

export default SingleLoanPageTasksContainer(SingleLoanPageTasks);
