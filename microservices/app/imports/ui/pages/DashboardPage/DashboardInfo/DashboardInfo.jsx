import React from 'react';
import PropTypes from 'prop-types';

import { T } from 'core/components/Translation';

import DashboardInfoTeam from './DashboardInfoTeam';
import DashboardInfoInterests from './DashboardInfoInterests';
import DashboardInfoLinks from './DashboardInfoLinks';

const DashboardInfo = props => (
  <div className="dashboard-info">
    <h2>
      <T id="DashboardInfo.title" />
    </h2>

    <div className="cards">
      <DashboardInfoTeam {...props} />
      <DashboardInfoInterests {...props} />
      <DashboardInfoLinks {...props} />
    </div>
  </div>
);

DashboardInfo.propTypes = {};

export default DashboardInfo;
