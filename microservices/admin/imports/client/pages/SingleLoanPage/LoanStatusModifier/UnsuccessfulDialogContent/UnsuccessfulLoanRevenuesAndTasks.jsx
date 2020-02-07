import React from 'react';
import { TASK_STATUS, REVENUE_STATUS } from 'core/api/constants';
import { useReactiveMeteorData } from 'core/hooks/useMeteorData';
import { tasks as tasksQuery } from 'core/api/tasks/queries';
import TasksTable from '../../../../components/TasksTable';
import RevenuesTable from '../../../../components/RevenuesTable';

const UnsuccessfulLoanRevenuesAndTasks = ({
  loan,
  returnValue,
  closeModal,
}) => {
  const { _id: loanId, tasksCache = [], revenues = [] } = loan;
  const activeTasks = tasksCache.filter(
    ({ status }) => status === TASK_STATUS.ACTIVE,
  );
  const expectedRevenues = revenues.filter(
    ({ status }) => status === REVENUE_STATUS.EXPECTED,
  );

  if (!activeTasks.length && !expectedRevenues.length) {
    closeModal({ ...returnValue });
    return null;
  }

  let tasks = [];

  if (activeTasks.length) {
    const { loading, data } = useReactiveMeteorData({
      query: tasksQuery,
      params: { loanId, status: TASK_STATUS.ACTIVE },
    });

    tasks = !loading ? data : [];
  }

  return (
    <div>
      {!!activeTasks.length && (
        <>
          <h3 className="mb-8">Tâches</h3>
          <TasksTable tasks={tasks} relatedTo={false} />
        </>
      )}
      {!!expectedRevenues.length && (
        <>
          <h3 className="mb-8">Revenus</h3>
          <RevenuesTable
            filterRevenues={() => ({ loanId, status: REVENUE_STATUS.EXPECTED })}
          />
        </>
      )}
    </div>
  );
};

export default UnsuccessfulLoanRevenuesAndTasks;
