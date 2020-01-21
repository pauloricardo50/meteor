// @flow
import React from 'react';

import NewLoansStat from './NewLoansStat';
import NewUsersStat from './NewUsersStat';
import LastSeenUsers from './LastSeenUsers';
import OutdatedRevenues from './OutdatedRevenues';
import LoansWithoutRevenues from './LoansWithoutRevenues';
import CustomersWithoutAssignees from './CustomersWithoutAssignees';
import RevenuesWithoutAssignees from './RevenuesWithoutAssignees';
import RevenuesWithoutCommissions from './RevenuesWithoutCommissions';

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
    <div>
      <h2>Stats</h2>
      <div className="flex wrap sa">
        <NewUsersStat />
        <NewLoansStat />
        <LastSeenUsers />
      </div>
    </div>

    <div>
      <h2>Santé de la base de donnée</h2>
      <div className="flex wrap sa">
        <OutdatedRevenues />
        <LoansWithoutRevenues />
        <CustomersWithoutAssignees />
        <RevenuesWithoutAssignees />
        <RevenuesWithoutCommissions />
      </div>
    </div>
  </div>
);

export default AdminDashboardStats;
