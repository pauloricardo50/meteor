import React from 'react';
import { Helmet } from 'react-helmet';

import T from 'core/components/Translation';
import Button from 'core/components/Button';
import { TASK_STATUS } from 'core/api/tasks/taskConstants';
import { adminLoanInsert } from 'core/api/loans/index';
import Icon from 'core/components/Icon/Icon';
import AllTasksTable from '../../components/TasksTable/AllTasksTable';
import { UserAdder } from '../../components/UserDialogForm';
import MyLoansTable from './MyLoansTable';
import AdminDashboardStats from './AdminDashboardStats';

const AdminDashboardPage = ({ currentUser, history }) => (
  <>
    <AdminDashboardStats />
    <section className="card1 card-top admin-dashboard-page">
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <h1 className="flex center-align">
        <Icon type="home" style={{ marginRight: 8 }} size={32} />
        <span>Admin Dashboard</span>
      </h1>

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

      <h2 className="text-center">
        <T id="AdminDashboardPage.tasks" />
      </h2>
      <AllTasksTable
        tableFilters={{
          filters: {
            assignedEmployee: { email: true },
            status: [TASK_STATUS.ACTIVE],
          },
          options: {
            email: [currentUser.email, undefined],
            status: Object.values(TASK_STATUS),
          },
        }}
      />

      <h2 className="text-center">Mes dossiers</h2>
      <MyLoansTable currentUser={currentUser} />
    </section>
  </>
);

export default AdminDashboardPage;
