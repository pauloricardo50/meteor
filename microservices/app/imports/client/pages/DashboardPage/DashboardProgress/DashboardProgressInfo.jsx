import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'core/components/Icon';

const DashboardProgressInfo = () => (
  <div className="dashboard-progress-info">
    <div className="text">
      <Icon className="icon" type="radioButtonChecked" />
      <p>TODO</p>
    </div>
  </div>
);

DashboardProgressInfo.propTypes = {};

DashboardProgressInfo.defaultProps = {};

export default DashboardProgressInfo;
