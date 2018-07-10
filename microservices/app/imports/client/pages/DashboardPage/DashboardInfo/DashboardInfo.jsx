import React from 'react';

import T from 'core/components/Translation';

import DashboardInfoTeam from './DashboardInfoTeam';
import LoanInterestRatesCard from '../../../components/LoanInterestRates/LoanInterestRatesCard';
// import DashboardInfoInterests from './DashboardInfoInterests';
// import DashboardInfoLinks from './DashboardInfoLinks';

const DashboardInfo = (props) => {
  const { loan } = props;

  return (
    <div className="dashboard-info">
      <h2 className="secondary">
        <small>
          <T id="DashboardInfo.title" />
        </small>
      </h2>

      <div className="cards">
        <DashboardInfoTeam {...props} />
        <LoanInterestRatesCard loan={loan} />
        {/* <DashboardInfoInterests {...props} />
      <DashboardInfoLinks {...props} /> */}
      </div>
    </div>
  );
};

export default DashboardInfo;
