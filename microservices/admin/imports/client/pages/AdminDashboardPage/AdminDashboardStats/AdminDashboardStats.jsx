import React, { useState } from 'react';

import Button from 'core/components/Button';

import CustomersWithoutAssignees from './CustomersWithoutAssignees';
import IncoherentAssignees from './IncoherentAssignees';
import LastSeenUsers from './LastSeenUsers';
import LoansThatShouldBeFinalized from './LoansThatShouldBeFinalized';
import LoansWithoutAssignees from './LoansWithoutAssignees';
import LoansWithoutLenders from './LoansWithoutLenders';
import LoansWithoutRevenues from './LoansWithoutRevenues';
import NewLoansStat from './NewLoansStat';
import NewUsersStat from './NewUsersStat';
import OutdatedRevenues from './OutdatedRevenues';
import RevenuesWithoutAssignees from './RevenuesWithoutAssignees';
import RevenuesWithoutCommissions from './RevenuesWithoutCommissions';
import UnpaidCommissions from './UnpaidCommissions';

const AdminDashboardStats = ({
  newLoans,
  setPeriod,
  period,
  showChart,
  setShowChart,
  loanHistogram,
}) => {
  const [showAll, setShowAll] = useState(false);
  return (
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
        <div className="flex center-align">
          <h2 className="mr-16">Santé de la base de données</h2>
          <Button onClick={() => setShowAll(!showAll)} size="small" primary>
            {showAll ? 'Tous' : 'Importants'}
          </Button>
        </div>
        <div className="flex wrap sa">
          <OutdatedRevenues showAll={showAll} />
          <UnpaidCommissions showAll={showAll} />
          <LoansWithoutRevenues showAll={showAll} />
          <CustomersWithoutAssignees showAll={showAll} />
          <RevenuesWithoutAssignees showAll={showAll} />
          <RevenuesWithoutCommissions showAll={showAll} />
          <IncoherentAssignees showAll={showAll} />
          <LoansWithoutLenders showAll={showAll} />
          <LoansWithoutAssignees showAll={showAll} />
          <LoansThatShouldBeFinalized showAll={showAll} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardStats;
