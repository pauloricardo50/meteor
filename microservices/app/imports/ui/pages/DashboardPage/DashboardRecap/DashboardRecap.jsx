import React from 'react';

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

export default DashboardRecap;
