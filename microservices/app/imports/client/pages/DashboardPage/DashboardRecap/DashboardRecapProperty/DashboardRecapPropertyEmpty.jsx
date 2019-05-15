// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/pro-light-svg-icons/faHome';

import Button from 'core/components/Button';
import { createRoute } from 'core/utils/routerUtils';
import T from 'core/components/Translation';
import ROUTES from '../../../../../startup/client/appRoutes';

type DashboardRecapPropertyEmptyProps = {
  loanId: string,
};

const DashboardRecapPropertyEmpty = ({
  loanId,
}: DashboardRecapPropertyEmptyProps) => (
  <div className="dashboard-recap-property card1 dashboard-recap-property-empty">
    <FontAwesomeIcon icon={faHome} className="icon" />
    <h3>
      <T id="DashboardRecapProperty.emptyTitle" />
    </h3>
    <p className="description">
      <T id="DashboardRecapProperty.emptyDescription" />
    </p>
    <Button
      link
      to={createRoute(ROUTES.PROPERTIES_PAGE.path, { loanId })}
      primary
    >
      <T id="DashboardRecapProperty.emptyButton" />
    </Button>
  </div>
);

export default DashboardRecapPropertyEmpty;
