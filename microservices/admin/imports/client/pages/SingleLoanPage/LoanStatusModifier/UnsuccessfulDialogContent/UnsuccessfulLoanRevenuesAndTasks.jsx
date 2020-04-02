import React from 'react';

import { REVENUE_STATUS } from 'core/api/revenues/revenueConstants';
import { TASKS_COLLECTION, TASK_STATUS } from 'core/api/tasks/taskConstants';
import { useReactiveMeteorData } from 'core/hooks/useMeteorData';

import RevenuesTable from '../../../../components/RevenuesTable';
import TasksTable from '../../../../components/TasksTable';
import { taskTableFragment } from '../../../../components/TasksTable/TasksTable';

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
      query: TASKS_COLLECTION,
      params: {
        $filters: { 'loanLink._id': loanId, status: TASK_STATUS.ACTIVE },
        ...taskTableFragment,
      },
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
            filterRevenues={() => ({
              'loanCache.0._id': loanId,
              status: REVENUE_STATUS.EXPECTED,
            })}
          />
        </>
      )}
    </div>
  );
};

export default UnsuccessfulLoanRevenuesAndTasks;
