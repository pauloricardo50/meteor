import React from 'react';
import { Helmet } from 'react-helmet';

import T from 'core/components/Translation';
import Icon from 'core/components/Icon/Icon';
import AllTasksTable from '../../components/TasksTable/AllTasksTable';
import { UserAdder } from '../../components/UserDialogForm';
import AdminDashboardStats from './AdminDashboardStats';
import LoanAdder from '../../components/LoanSummaryList/LoanAdder';

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
        <LoanAdder onSuccess={loanId => history.push(`/loans/${loanId}`)} />
      </div>

      <h2 className="text-center">
        <T id="AdminDashboardPage.tasks" />
      </h2>
      <AllTasksTable withPriority />
    </section>
  </>
);

export default AdminDashboardPage;
