import React from 'react';
import PropTypes from 'prop-types';

import { T, Money } from 'core/components/Translation';

const DashboardRecapChartInfo = ({ total }) => (
  <div className="dashboard-recap-chart-info">
    <h4>
      <T id="DashboardRecapChartInfo.label" />
    </h4>
    <span className="value">
      <Money value={total} />
    </span>
  </div>
);

DashboardRecapChartInfo.propTypes = {
  total: PropTypes.number.isRequired,
};

export default DashboardRecapChartInfo;
