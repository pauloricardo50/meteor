import React from 'react';

import T from 'core/components/Translation';

import DashboardInfoTeam from './DashboardInfoTeam';
// import DashboardInfoInterests from './DashboardInfoInterests';
// import DashboardInfoLinks from './DashboardInfoLinks';

const DashboardInfo = props => (
  <div className="dashboard-info">
    <h2 className="secondary">
      <small>
        <T id="DashboardInfo.title" />
      </small>
    </h2>

    <div className="cards">
      <DashboardInfoTeam {...props} />
      {/* <DashboardInfoInterests {...props} />
      <DashboardInfoLinks {...props} /> */}
    </div>
  </div>
);

export default DashboardInfo;
