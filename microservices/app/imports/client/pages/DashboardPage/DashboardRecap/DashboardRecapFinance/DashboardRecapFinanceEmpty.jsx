//
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar } from '@fortawesome/pro-light-svg-icons/faChartBar';

import Button from 'core/components/Button';
import { createRoute } from 'core/utils/routerUtils';
import T from 'core/components/Translation';
import APP_ROUTES from '../../../../../startup/client/appRoutes';

const DashboardRecapFinanceEmpty = ({ loan }) => (
  <div className="dashboard-recap-finance card1 dashboard-recap-finance-empty">
    <FontAwesomeIcon icon={faChartBar} className="icon" />
    <h3>
      <T id="DashboardRecapFinance.emptyTitle" />
    </h3>
    <p className="description">
      <T id="DashboardRecapFinance.emptyDescription" />
    </p>
    <Button
      link
      to={createRoute(APP_ROUTES.FINANCING_PAGE.path, { loanId: loan._id })}
      primary
    >
      <T id="DashboardRecapFinance.emptyButton" />
    </Button>
  </div>
);

export default DashboardRecapFinanceEmpty;
