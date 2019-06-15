import React from 'react';
import { Helmet } from 'react-helmet';

import T from 'core/components/Translation';
import Button from 'core/components/Button';
import Icon from 'core/components/Icon/Icon';
import { TASK_STATUS } from 'core/api/tasks/taskConstants';
import { adminLoanInsert } from 'core/api/loans/index';
import AllTasksTable from '../../components/TasksTable/AllTasksTable';
import { UserAdder } from '../../components/UserDialogForm';
import AdminDashboardStats from './AdminDashboardStats';
import AdminDashboardTabs from './AdminDashboardTabs';

const AdminDashboardPage = ({ currentUser, history }) => (
  <>
    <AdminDashboardTabs />
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
            assignee: { email: true },
            status: [TASK_STATUS.ACTIVE],
          },
          options: {
            email: [currentUser.email, undefined],
            status: Object.values(TASK_STATUS),
          },
        }}
      />
    </section>
  </>
);

export default AdminDashboardPage;
