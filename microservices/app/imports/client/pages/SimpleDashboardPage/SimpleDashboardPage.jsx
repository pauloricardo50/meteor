// @flow
import React from 'react';

import MaxPropertyValue from '../../components/MaxPropertyValue/MaxPropertyValue';
import DashboardProgressBar from '../DashboardPage/DashboardProgress/DashboardProgressBar';
import BorrowersProgress from './BorrowersProgress';

type SimpleDashboardPageProps = {};

const SimpleDashboardPage = (props: SimpleDashboardPageProps) => (
  <div className="simple-dashboard-page">
    <DashboardProgressBar {...props} />

    <div className="simple-dashboard-page-borrowers card1">
      <BorrowersProgress {...props} />
      <MaxPropertyValue {...props} />
    </div>
  </div>
);

export default SimpleDashboardPage;
