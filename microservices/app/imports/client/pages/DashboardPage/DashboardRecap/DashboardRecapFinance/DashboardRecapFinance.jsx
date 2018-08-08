import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { createRoute } from 'core/utils/routerUtils';
import Calculator from 'core/utils/Calculator';
import T from 'core/components/Translation';
import DashboardRecapCost from './DashboardRecapCost';
import DashboardRecapFinancing from './DashboardRecapFinancing';
import DashboardRecapChart from './DashboardRecapChart';
import { FINANCING_PAGE } from '../../../../../startup/client/appRoutes';

const shouldDisplayRecap = ({ loan }) => loan.properties[0].value;

const DashboardRecapFinance = (props) => {
  if (!shouldDisplayRecap(props)) {
    return (
      <div className="dashboard-recap-finance card1">
        <p className="dashboard-recap-finance-empty description">
          <T id="DashboardRecapFinance.empty" />
        </p>
      </div>
    );
  }

  const totalCost = Calculator.getProjectValue({ loan: props.loan });

  return (
    <Link
      className="dashboard-recap-finance card1 card-hover"
      to={createRoute(FINANCING_PAGE, { ':loanId': props.loan._id })}
    >
      <div className="card-top">
        <h3>
          <T id="DashboardRecapFinance.title" />
        </h3>
        <div className="accounting">
          <DashboardRecapCost {...props} total={totalCost} />
          <span className="divider" />
          <DashboardRecapFinancing {...props} total={totalCost} />
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
