import React from 'react';
import PropTypes from 'prop-types';

import { getProjectValue } from 'core/utils/loanFunctions';
import { T } from 'core/components/Translation';
import DashboardRecapCost from './DashboardRecapCost';
import DashboardRecapFinancing from './DashboardRecapFinancing';
import DashboardRecapChart from './DashboardRecapChart';

const shouldDisplayRecap = ({ property, loan, borrowers }) => property.value;

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

  const totalCost = getProjectValue(props);
  return (
    <div className="dashboard-recap-finance card1">
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
    </div>
  );
};

DashboardRecapFinance.propTypes = {
  loan: PropTypes.object.isRequired,
  property: PropTypes.object.isRequired,
};

export default DashboardRecapFinance;
