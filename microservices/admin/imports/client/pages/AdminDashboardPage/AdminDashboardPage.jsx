import React from 'react';
import { Helmet } from 'react-helmet';

import T from 'core/components/Translation';
import Button from 'core/components/Button';
import Icon from 'core/components/Icon/Icon';
import { TASK_STATUS } from 'core/api/tasks/taskConstants';
import { adminLoanInsert } from 'core/api/loans/index';
import ADMIN_ROUTES from '../../../startup/client/adminRoutes';
import AllTasksTable from '../../components/TasksTable/AllTasksTable';
import { UserAdder } from '../../components/UserDialogForm';
import AdminDashboardStats from './AdminDashboardStats';
import LoanBoard from './LoanBoard';

const AdminDashboardPage = ({ currentUser, history }) => {
  const { pathname } = history.location;
  const isDashboard = pathname === ADMIN_ROUTES.DASHBOARD_PAGE.path;
  const isLoanBoard = pathname === ADMIN_ROUTES.LOAN_BOARD_PAGE.path;
  let content = null;

  if (isDashboard) {
    content = (
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
  }

  if (isLoanBoard) {
    content = <LoanBoard currentUser={currentUser} />;
  }

  return (
    <>
      <div className="flex center" style={{ marginBottom: 16 }}>
        <Button
          raised={isDashboard}
          primary={isDashboard}
          to={ADMIN_ROUTES.DASHBOARD_PAGE.path}
          link
        >
          Dashboard
        </Button>
        <Button
          raised={isLoanBoard}
          primary={isLoanBoard}
          to={ADMIN_ROUTES.LOAN_BOARD_PAGE.path}
          link
        >
          Dossiers
        </Button>
      </div>
      {content}
    </>
  );
};

export default AdminDashboardPage;
