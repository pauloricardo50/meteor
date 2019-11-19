// @flow
import React from 'react';

import NewLoansStat from './NewLoansStat';
import NewUsersStat from './NewUsersStat';
import LastSeenUsers from './LastSeenUsers';
import OutdatedRevenues from './OutdatedRevenues';
import LoansWithoutRevenues from './LoansWithoutRevenues';

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
    <NewUsersStat />
    <NewLoansStat />
    <LastSeenUsers />
    <OutdatedRevenues />
    <LoansWithoutRevenues />
  </div>
);

export default AdminDashboardStats;
