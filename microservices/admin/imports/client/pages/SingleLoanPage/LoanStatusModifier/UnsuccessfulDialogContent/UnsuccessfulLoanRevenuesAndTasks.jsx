import React from 'react';
import { REVENUES_COLLECTION } from 'imports/core/api/revenues/revenueConstants';

import { REVENUE_STATUS } from 'core/api/revenues/revenueConstants';
import { TASKS_COLLECTION, TASK_STATUS } from 'core/api/tasks/taskConstants';
import Loading from 'core/components/Loading';
import { useReactiveMeteorData } from 'core/hooks/useMeteorData';

import RevenuesTable from '../../../../components/RevenuesTable';
import TasksTable from '../../../../components/TasksTable';
import { taskTableFragment } from '../../../../components/TasksTable/TasksTable';

const UnsuccessfulLoanRevenuesAndTasks = ({
  loan,
  returnValue,
  closeModal,
}) => {
  const { _id: loanId, revenues = [] } = loan;
  const expectedRevenues = revenues.filter(
    ({ status }) => status === REVENUE_STATUS.EXPECTED,
  );

  const { loading: loadingTasks, data: tasks = [] } = useReactiveMeteorData({
    query: TASKS_COLLECTION,
    params: {
      $filters: { 'loanLink._id': loanId, status: TASK_STATUS.ACTIVE },
      ...taskTableFragment,
    },
  });

  if (loadingTasks) {
    return <Loading />;
  }

  if (!expectedRevenues.length && !tasks.length) {
    closeModal({ ...returnValue });
    return null;
  }

  return (
    <div>
      {!!tasks.length && (
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
