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
  const { _id: loanId } = loan;

  const { loading: loadingTasks, data: tasks = [] } = useReactiveMeteorData({
    query: TASKS_COLLECTION,
    params: {
      $filters: { 'loanLink._id': loanId, status: TASK_STATUS.ACTIVE },
      ...taskTableFragment,
    },
  });

  const {
    loading: loadingRevenues,
    data: revenues = [],
  } = useReactiveMeteorData({
    query: REVENUES_COLLECTION,
    params: {
      $filters: { 'loanCache._id': loanId, status: REVENUE_STATUS.EXPECTED },
      amount: 1,
      assigneeLink: 1,
      description: 1,
      expectedAt: 1,
      loan: {
        name: 1,
        borrowers: { name: 1 },
        user: { name: 1 },
        userCache: 1,
        assigneeLinks: 1,
      },
      paidAt: 1,
      sourceOrganisationLink: 1,
      sourceOrganisation: { name: 1 },
      status: 1,
      type: 1,
      organisationLinks: 1,
      organisations: { name: 1 },
      insurance: {
        name: 1,
        insuranceRequest: { _id: 1 },
        borrower: { name: 1 },
      },
      insuranceRequest: { name: 1 },
    },
  });

  if (loadingTasks || loadingRevenues) {
    return <Loading />;
  }

  if (!revenues.length && !tasks.length) {
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
      {!!revenues.length && (
        <>
          <h3 className="mb-8">Revenus</h3>
          <RevenuesTable revenues={revenues} />
        </>
      )}
    </div>
  );
};

export default UnsuccessfulLoanRevenuesAndTasks;
