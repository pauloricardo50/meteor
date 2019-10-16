import React from 'react';
import { withRouter } from 'react-router-dom';

import T from 'core/components/Translation';
import { LoanChecklistDialog } from 'core/components/LoanChecklist';

import DashboardProgressBar from './DashboardProgressBar';
import DashboardProgressInfo from './DashboardProgressInfo';

const DashboardProgress = props => (
  <div className="dashboard-progress">
    <p className="title">
      <b>
        <T id="DashboardProgressBar.title" />
      </b>
    </p>
    {!props.loan.hasPromotion && (
      <DashboardProgressBar {...props} currentStep={props.loan.step} />
    )}
    <DashboardProgressInfo {...props} />
    <LoanChecklistDialog {...props} />
  </div>
);

export default withRouter(DashboardProgress);
