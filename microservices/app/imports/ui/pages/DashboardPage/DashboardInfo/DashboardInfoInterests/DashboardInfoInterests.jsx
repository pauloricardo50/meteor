import React from 'react';
import PropTypes from 'prop-types';

import { T } from 'core/components/Translation';

const DashboardInfoInterests = props => (
  <div className="dashboard-info-interests card1">
    <div className="card-top">
      <h3>
        <T id="DashboardInfoInterests.title" />
      </h3>
    </div>
  </div>
);

DashboardInfoInterests.propTypes = {};

export default DashboardInfoInterests;
