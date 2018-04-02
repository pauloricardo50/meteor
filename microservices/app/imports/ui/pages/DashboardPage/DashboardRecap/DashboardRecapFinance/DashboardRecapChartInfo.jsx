import React from 'react';
import PropTypes from 'prop-types';

import { T } from 'core/components/Translation';
import { toMoney } from 'core/utils/conversionFunctions';

const DashboardRecapChartInfo = ({ total, revenuePercent }) => (
  <div className="dashboard-recap-chart-info">
    <h4>
      <T id="DashboardRecapChartInfo.label" />
    </h4>
    <span className="value">CHF {toMoney(total)}</span>
    {revenuePercent > 0 && (
      <span className="revenue-percent">
        <T
          id="DashboardRecapChartInfo.revenuePercent"
          values={{ revenuePercent }}
        />
      </span>
    )}
  </div>
);

DashboardRecapChartInfo.propTypes = {
  total: PropTypes.number.isRequired,
  revenuePercent: PropTypes.number.isRequired,
};

export default DashboardRecapChartInfo;
