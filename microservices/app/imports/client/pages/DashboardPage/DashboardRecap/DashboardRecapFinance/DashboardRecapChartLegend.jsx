import React from 'react';
import PropTypes from 'prop-types';

import T from 'core/components/Translation';
import colors from 'core/config/colors';
import { toMoney } from 'core/utils/conversionFunctions';

const DashboardRecapChartLegend = ({ data }) => (
  <div className="dashboard-recap-chart-legend">
    {data.map(({ id, value }, index) => (
      <div key={id} className="legend-line">
        <span
          className="color"
          style={{ backgroundColor: colors.charts[index] }}
        />
        <span className="id">
          <T id={id} />
        </span>
        {toMoney(value)}
      </div>
    ))}
  </div>
);

DashboardRecapChartLegend.propTypes = {
  data: PropTypes.array.isRequired,
};

export default DashboardRecapChartLegend;
