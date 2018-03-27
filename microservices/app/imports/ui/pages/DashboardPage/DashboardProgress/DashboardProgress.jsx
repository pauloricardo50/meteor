import React from 'react';
import PropTypes from 'prop-types';

import { T } from 'core/components/Translation';

import DashboardProgressBar from './DashboardProgressBar';
import DashboardProgressInfo from './DashboardProgressInfo';
import DashboardProgressContainer from './DashboardProgressContainer';

const DashboardProgress = props => (
  <div className="dashboard-progress">
    <p className="title">
      <b>
        <T id="DashboardProgressBar.title" />
      </b>
    </p>
    <DashboardProgressBar {...props} />
    <DashboardProgressInfo {...props} />
  </div>
);

DashboardProgress.propTypes = {};

export default DashboardProgressContainer(DashboardProgress);
