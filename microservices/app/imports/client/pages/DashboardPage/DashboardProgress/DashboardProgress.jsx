import React from 'react';

import T from 'core/components/Translation';
import { LoanChecklistDialog } from 'core/components/LoanChecklist';

import DashboardProgressBar from './DashboardProgressBar';
import DashboardProgressInfo from './DashboardProgressInfo';
import DashboardProgressContainer from './DashboardProgressContainer';

const DashboardProgress = props => (
  <div className="dashboard-progress">
    <p className="title">
      <b>
        <T id="DashboardProgressBar.title" />
      </b>
    </p>
    <DashboardProgressBar {...props} />
    <DashboardProgressInfo {...props} />
    {/* <LoanChecklistDialog {...props} /> */}
  </div>
);

export default DashboardProgressContainer(DashboardProgress);
