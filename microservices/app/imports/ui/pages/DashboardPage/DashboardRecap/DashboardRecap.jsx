import React from 'react';
import PropTypes from 'prop-types';

import { T } from 'core/components/Translation';

import DashboardRecapFinance from './DashboardRecapFinance';
import DashboardRecapProperty from './DashboardRecapProperty';

const DashboardRecap = props => (
  <div className="dashboard-recap">
    <h2>
      <T id="DashboardRecap.title" />
    </h2>

    <div className="cards">
      <DashboardRecapFinance {...props} />
      <DashboardRecapProperty {...props} />
    </div>
  </div>
);

DashboardRecap.propTypes = {};

export default DashboardRecap;
