import React from 'react';

import T from 'core/components/Translation';

import DashboardInfoInterests from './DashboardInfoInterests';
import DashboardInfoTeam from './DashboardInfoTeam';

const DashboardInfo = props => {
  const { loan } = props;

  return (
    <div className="dashboard-info">
      <h2 className="secondary">
        <small>
          <T id="DashboardInfo.title" />
        </small>
      </h2>

      <div className="cards">
        <DashboardInfoTeam {...props} />
        {(!loan.hasPromotion || loan.offers?.length > 0) && (
          <DashboardInfoInterests loan={loan} />
        )}
      </div>
    </div>
  );
};

export default DashboardInfo;
