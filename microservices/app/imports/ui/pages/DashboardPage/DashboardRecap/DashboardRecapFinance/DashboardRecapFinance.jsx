import React from 'react';
import PropTypes from 'prop-types';

import DashboardRecapCost from './DashboardRecapCost';
import DashboardRecapFinancing from './DashboardRecapFinancing';
import DashboardRecapChart from './DashboardRecapChart';

const DashboardRecapFinance = props => (
  <div className="dashboard-recap-finance card1">
    <div className="card-top">
      <h3>Plan Financier</h3>
      <div className="accounting">
        <DashboardRecapCost {...props} />
        <DashboardRecapFinancing {...props} />
      </div>
    </div>
    <DashboardRecapChart {...props} />
  </div>
);

DashboardRecapFinance.propTypes = {};

export default DashboardRecapFinance;
