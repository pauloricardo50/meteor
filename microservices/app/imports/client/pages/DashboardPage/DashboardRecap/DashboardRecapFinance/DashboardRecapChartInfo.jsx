import React from 'react';
import PropTypes from 'prop-types';

import { Money } from 'core/components/Translation';

const DashboardRecapChartInfo = ({ total }) => (
  <div className="dashboard-recap-chart-info">
    <span className="value">
      <Money value={total} />
    </span>
  </div>
);

DashboardRecapChartInfo.propTypes = {
  total: PropTypes.number.isRequired,
};

export default DashboardRecapChartInfo;
