import React from 'react';
import { Helmet } from 'react-helmet';

import Icon from 'core/components/Icon/Icon';
import T from 'core/components/Translation';

import LoanAdder from '../../components/LoanSummaryList/LoanAdder';
import TasksTableWithPriority from '../../components/TasksDataTable/TasksTableWithPriority';
import { UserAdder } from '../../components/UserDialogForm';
import AdminDashboardStats from './AdminDashboardStats';
import AdvisorsStatus from './AdvisorsStatus';

const AdminDashboardPage = ({ currentUser, history }) => (
  <>
    <AdminDashboardStats />
    <section className="card1 card-top admin-dashboard-page">
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <div className="flex sb">
        <div>
          <h1 className="flex center-align mt-0">
            <Icon type="home" style={{ marginRight: 8 }} size={32} />
            <span>Admin Dashboard</span>
          </h1>

          <div className="flex">
            <UserAdder
              currentUser={currentUser}
              buttonProps={{ className: 'mr-8' }}
            />
            <LoanAdder onSuccess={loanId => history.push(`/loans/${loanId}`)} />
          </div>
        </div>

        <AdvisorsStatus />
      </div>

      <h2 className="text-center">
        <T id="AdminDashboardPage.tasks" />
      </h2>
      <TasksTableWithPriority />
    </section>
  </>
);

export default AdminDashboardPage;
