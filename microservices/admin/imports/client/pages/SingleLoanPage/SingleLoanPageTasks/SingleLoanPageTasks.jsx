import React from 'react';

import LoanTaskInserter from './LoanTaskInserter';
import TasksTable from '../../../components/TasksTable';
import SingleLoanPageTasksContainer from './SingleLoanPageTasksContainer';

const SingleLoanPageTasks = ({
  loan,
  refetch,
  tasks,
  model,
  openOnMount,
  resetForm,
  ...rest
}) => (
  <div className="card1 card-top single-loan-page-tasks">
    <div className="flex">
      <h3>Tâches</h3>
      <LoanTaskInserter
        loan={loan}
        refetch={refetch}
        model={model}
        openOnMount={openOnMount}
        resetForm={resetForm}
      />
    </div>
    <TasksTable tasks={tasks} relatedTo={false} {...rest} />
  </div>
);

export default SingleLoanPageTasksContainer(SingleLoanPageTasks);
