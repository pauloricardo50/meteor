// @flow
import React from 'react';

import T from 'core/components/Translation';
import LoanCards from './LoanCards';

type SuperDashboardProps = {
  currentUser: Object,
};

const SuperDashboard = ({ currentUser = {} }: SuperDashboardProps) => {
  const { name, loans = [] } = currentUser;
  return (
    <div className="super-dashboard">
      <div className="super-dashboard-title">
        <h1>
          <T id="SuperDashboard.welcome" values={{ name }} />
        </h1>
        <p>
          <T id="SuperDashboard.welcome.subtitle" />
        </p>
      </div>
      <LoanCards loans={loans} />
    </div>
  );
};

export default SuperDashboard;
