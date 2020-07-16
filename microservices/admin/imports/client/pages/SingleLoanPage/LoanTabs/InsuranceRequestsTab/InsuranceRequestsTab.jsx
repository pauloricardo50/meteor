import React from 'react';

import InsurancePotential from '../../../../components/InsurancePotential/InsurancePotential';
import InsuranceRequestsSummaryList from '../../../../components/InsuranceRequestsSummaryList/InsuranceRequestsSummaryList';

const InsuranceRequestsTab = ({ loan }) => {
  const { insuranceRequests = [] } = loan;
  return (
    <div className="flex-col">
      <InsurancePotential loan={loan} />
      <InsuranceRequestsSummaryList
        insuranceRequests={insuranceRequests}
        loan={loan}
      />
    </div>
  );
};

export default InsuranceRequestsTab;
