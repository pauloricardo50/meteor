import React from 'react';
import PropTypes from 'prop-types';

import { getProjectValue } from 'core/utils/loanFunctions';

import DashboardRecapCost from './DashboardRecapCost';
import DashboardRecapFinancing from './DashboardRecapFinancing';
import DashboardRecapChart from './DashboardRecapChart';

const DashboardRecapFinance = (props) => {
  const totalCost = getProjectValue(props);
  return (
    <div className="dashboard-recap-finance card1">
      <div className="card-top">
        <h3>Plan Financier</h3>
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

DashboardRecapFinance.propTypes = {};

export default DashboardRecapFinance;
