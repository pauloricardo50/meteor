import React from 'react';
import InsuranceAdder from './InsuranceAdder';
import InsurancesTable from './InsurancesTable';

const InsurancesTab = props => {
  const { insuranceRequest } = props;

  return (
    <div className="insurances-tab">
      <InsuranceAdder insuranceRequest={insuranceRequest} />
      <InsurancesTable insuranceRequest={insuranceRequest} />
    </div>
  );
};

export default InsurancesTab;
