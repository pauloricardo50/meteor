import React from 'react';
import PropTypes from 'prop-types';

import { toMoney } from 'core/utils/conversionFunctions';

const DashboardRecapSum = ({ label, value }) => (
  <div className="dashboard-recap-sum fixed-size">
    <h4 className="label">{label}:</h4>
    <h3 className="value">{toMoney(value)}</h3>
  </div>
);

DashboardRecapSum.propTypes = {
  label: PropTypes.node.isRequired,
  value: PropTypes.number.isRequired,
};

export default DashboardRecapSum;
