import React from 'react';
import PropTypes from 'prop-types';

import { T } from 'core/components/Translation';

const colors = [];

const DashboardRecapChartLegend = ({ data }) => (
  <div className="dashboard-recap-chart-legend">
    {data.map(({ id, value }, index) => (
      <div key={id} className="legend-line">
        <span className="color" style={{ backgroundColor: colors[index] }} />
        <span className="id">
          <T id={id} />
        </span>
        {value}
      </div>
    ))}
  </div>
);

DashboardRecapChartLegend.propTypes = {
  data: PropTypes.array.isRequired,
};

export default DashboardRecapChartLegend;
