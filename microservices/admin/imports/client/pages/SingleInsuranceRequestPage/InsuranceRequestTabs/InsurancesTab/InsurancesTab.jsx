import React from 'react';
import InsuranceAdder from './InsuranceAdder';

const InsurancesTab = props => {
  const { insuranceRequest } = props;
  console.log('insuranceRequest:', insuranceRequest);

  return (
    <div className="insurances-tab">
      <InsuranceAdder insuranceRequest={insuranceRequest} />
    </div>
  );
};

export default InsurancesTab;
