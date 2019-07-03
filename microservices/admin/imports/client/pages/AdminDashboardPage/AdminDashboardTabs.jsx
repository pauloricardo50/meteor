// @flow
import React from 'react';
import { withRouter } from 'react-router-dom';

import Button from 'core/components/Button';
import ADMIN_ROUTES from '../../../startup/client/adminRoutes';

type AdminDashboardTabsProps = {};

const AdminDashboardTabs = ({ history }: AdminDashboardTabsProps) => {
  const { pathname } = history.location;

  const isDashboard = pathname === ADMIN_ROUTES.DASHBOARD_PAGE.path;
  const isLoanBoard = pathname === ADMIN_ROUTES.LOAN_BOARD_PAGE.path;

  return (
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
  );
};

export default withRouter(AdminDashboardTabs);
