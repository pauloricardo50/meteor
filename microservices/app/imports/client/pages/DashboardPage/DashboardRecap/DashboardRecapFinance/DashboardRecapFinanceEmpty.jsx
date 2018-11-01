// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar } from '@fortawesome/pro-light-svg-icons';

import Button from 'core/components/Button';
import { createRoute } from 'core/utils/routerUtils';
import T from 'core/components/Translation';
import { FINANCING_PAGE } from '../../../../../startup/client/appRoutes';

type DashboardRecapFinanceEmptyProps = {};

const DashboardRecapFinanceEmpty = ({
  loan,
}: DashboardRecapFinanceEmptyProps) => (
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
      to={createRoute(FINANCING_PAGE, { loanId: loan._id })}
      // outlined
      primary
    >
      <T id="DashboardRecapFinance.emptyButton" />
    </Button>
  </div>
);

export default DashboardRecapFinanceEmpty;
