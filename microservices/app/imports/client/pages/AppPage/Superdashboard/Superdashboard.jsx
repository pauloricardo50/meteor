// @flow
import React from 'react';
import T from 'core/components/Translation';

import LoanCards from './LoanCards';

type SuperdashboardProps = {
  currentUser: Object,
};

const Superdashboard = ({ currentUser = {} }: SuperdashboardProps) => {
  const { name, loans = [] } = currentUser;
  return (
    <div className="superdashboard">
      <div className="superdashboard-title">
        <h1>
          <T id="Superdashboard.welcome" values={{ name }} />
        </h1>
        <p>
          <T id="Superdashboard.welcome.subtitle" />
        </p>
      </div>
      <LoanCards loans={loans} />
    </div>
  );
};

export default Superdashboard;
