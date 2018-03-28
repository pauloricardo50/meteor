import React from 'react';
import PropTypes from 'prop-types';

import DashboardRecapFinance from './DashboardRecapFinance';
import DashboardRecapProperty from './DashboardRecapProperty';

const DashboardRecap = props => (
  <div className="dashboard-recap">
    <h3>Title</h3>

    <div className="cards">
      <DashboardRecapFinance />
      <DashboardRecapProperty />
    </div>
  </div>
);

DashboardRecap.propTypes = {};

export default DashboardRecap;
