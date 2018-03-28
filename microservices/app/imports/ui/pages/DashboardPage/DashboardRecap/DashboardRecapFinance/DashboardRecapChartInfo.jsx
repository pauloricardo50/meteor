import React from 'react';
import PropTypes from 'prop-types';

import { T } from 'core/components/Translation';
import { toMoney } from 'core/utils/conversionFunctions';

const DashboardRecapChartInfo = ({ total, percentOfRevenue }) => (
  <div className="dashboard-recap-chart-info">
    <h4>
      <T id="DashboardRecapChartInfo.label" />
    </h4>
    <span className="value">CHF {toMoney(total)}</span>
    <span className="revenue-percent">
      <T
        id="DashboardRecapChartInfo.revenuePercent"
        values={{ percent: percentOfRevenue }}
      />
    </span>
  </div>
);

DashboardRecapChartInfo.propTypes = {
  total: PropTypes.number.isRequired,
  percentOfRevenue: PropTypes.number.isRequired,
};

export default DashboardRecapChartInfo;
