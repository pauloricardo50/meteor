// @flow
import React from 'react';

import SimpleMaxPropertyValue from '../../components/SimpleMaxPropertyValue';
import DashboardProgressBar from '../DashboardPage/DashboardProgress/DashboardProgressBar';
import BorrowersProgress from './BorrowersProgress';

type SimpleDashboardPageProps = {};

const SimpleDashboardPage = (props: SimpleDashboardPageProps) => (
  <div className="simple-dashboard-page animated fadeIn">
    <DashboardProgressBar {...props} />

    <div className="simple-dashboard-page-borrowers card1">
      <BorrowersProgress {...props} />
      <SimpleMaxPropertyValue {...props} />
    </div>
  </div>
);

export default SimpleDashboardPage;
