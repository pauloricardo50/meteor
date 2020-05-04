import React from 'react';
import PropTypes from 'prop-types';

import Link from 'core/components/Link';
import T from 'core/components/Translation';
import Calculator from 'core/utils/Calculator';
import { createRoute } from 'core/utils/routerUtils';

import APP_ROUTES from '../../../../../startup/client/appRoutes';
import DashboardRecapChart from './DashboardRecapChart';
import DashboardRecapCost from './DashboardRecapCost';
import DashboardRecapFinanceEmpty from './DashboardRecapFinanceEmpty';
import DashboardRecapFinancing from './DashboardRecapFinancing';

const shouldDisplayRecap = loan =>
  Calculator.loanHasMinimalInformation({ loan });

const DashboardRecapFinance = props => {
  const { loan } = props;
  if (!shouldDisplayRecap(loan)) {
    return <DashboardRecapFinanceEmpty loan={loan} />;
  }

  const totalCost = Calculator.getProjectValue({ loan });
  const totalFinancing = Calculator.getTotalFinancing({ loan });

  return (
    <Link
      className="dashboard-recap-finance card1 card-hover"
      to={createRoute(APP_ROUTES.FINANCING_PAGE.path, { loanId: loan._id })}
    >
      <div className="card-top">
        <h3>
          <T id="DashboardRecapFinance.title" />
        </h3>
        <div className="accounting">
          <DashboardRecapCost {...props} total={totalCost} />
          <span className="divider" />
          <DashboardRecapFinancing {...props} total={totalFinancing} />
        </div>
      </div>
      <DashboardRecapChart {...props} />
    </Link>
  );
};

DashboardRecapFinance.propTypes = {
  loan: PropTypes.object.isRequired,
};

export default DashboardRecapFinance;
