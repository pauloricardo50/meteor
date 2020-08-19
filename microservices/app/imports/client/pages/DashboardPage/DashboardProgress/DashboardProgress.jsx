import React from 'react';
import { withRouter } from 'react-router-dom';

import { LoanChecklistDialog } from 'core/components/LoanChecklist';
import T from 'core/components/Translation';

import DashboardProgressBar from './DashboardProgressBar';
import DashboardProgressInfo from './DashboardProgressInfo';

const DashboardProgress = props => (
  <div className="dashboard-progress card1 card-top">
    <h3 className="title">
      <T id="DashboardProgressBar.title" />
    </h3>
    {/* <DashboardProgressBar {...props} /> */}
    <DashboardProgressInfo {...props} />
    <LoanChecklistDialog {...props} />
  </div>
);

export default withRouter(DashboardProgress);
