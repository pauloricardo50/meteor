import React from 'react';

import T from 'core/components/Translation/';
import DashboardInfoInterestsTable from './DashboardInfoInterestsTable';

const DashboardInfoInterests = ({ loan }) => {
  const { _id } = loan;

  return (
    <div className="dashboard-info-team card1">
      <div className="card-top">
        <h3>
          <T id="DashboardInfoInterests.title" />
        </h3>

        <DashboardInfoInterestsTable loan={loan} />
      </div>
    </div>
  );
};

export default DashboardInfoInterests;
