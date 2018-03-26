import React from 'react';
import PropTypes from 'prop-types';

import { T } from 'core/components/Translation';

const DashboardProgressBar = ({ steps }) => (
  <div className="dashboard-progress-bar">
    {steps.map(({ nb }) => (
      <div key={nb}>
        <T id={`steps.${nb}.title`} />
      </div>
    ))}
  </div>
);

DashboardProgressBar.propTypes = {};

export default DashboardProgressBar;
