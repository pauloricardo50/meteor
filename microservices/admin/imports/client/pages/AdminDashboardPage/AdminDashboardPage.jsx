import React from 'react';

import T from 'core/components/Translation';
import Button from 'core/components/Button';
import { TASK_STATUS } from 'core/api/tasks/taskConstants';
import { adminLoanInsert } from 'core/api/loans/index';
import AllTasksTable from '../../components/TasksTable/AllTasksTable';
import { UserAdder } from '../../components/UserDialogForm';
import MyLoansTable from './MyLoansTable';

const AdminDashboardPage = ({ currentUser, history }) => (
  <section className="card1 card-top admin-dashboard-page">
    <h1>Admin Dashboard</h1>

    <div className="flex space-children">
      <UserAdder currentUser={currentUser} />
      <Button
        primary
        raised
        onClick={() =>
          adminLoanInsert
            .run({})
            .then(loanId => history.push(`/loans/${loanId}`))
        }
      >
        Nouvelle hypothèque
      </Button>
    </div>

    <h2 className="text-center">Mes dossiers</h2>
    <MyLoansTable currentUser={currentUser} />

    <h2 className="text-center">
      <T id="AdminDashboardPage.tasks" />
    </h2>
    <AllTasksTable
      tableFilters={{
        filters: {
          assignedEmployee: { emails: [{ address: true }] },
          status: [TASK_STATUS.ACTIVE],
        },
        options: {
          address: [currentUser.email, undefined],
          status: Object.values(TASK_STATUS),
        },
      }}
    />
  </section>
);

export default AdminDashboardPage;
