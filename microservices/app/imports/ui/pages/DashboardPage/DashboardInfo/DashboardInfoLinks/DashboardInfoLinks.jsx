import React from 'react';
import PropTypes from 'prop-types';

import { T } from 'core/components/Translation';

const DashboardInfoLinks = props => (
  <div className="dashboard-info-links card1">
    <div className="card-top">
      <h3>
        <T id="DashboardInfoLinks.title" />
      </h3>
    </div>
  </div>
);

DashboardInfoLinks.propTypes = {};

export default DashboardInfoLinks;
