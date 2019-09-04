// @flow
import React from 'react';

import NewLoansStat from './NewLoansStat';
import LastSeenUsers from './LastSeenUsers';
import OutdatedRevenues from './OutdatedRevenues';

type AdminDashboardStatsProps = {};

const AdminDashboardStats = ({
  newLoans,
  setPeriod,
  period,
  showChart,
  setShowChart,
  loanHistogram,
}: AdminDashboardStatsProps) => (
  <div className="admin-stats">
    <NewLoansStat />
    <LastSeenUsers />
    <OutdatedRevenues />
  </div>
);

export default AdminDashboardStats;
