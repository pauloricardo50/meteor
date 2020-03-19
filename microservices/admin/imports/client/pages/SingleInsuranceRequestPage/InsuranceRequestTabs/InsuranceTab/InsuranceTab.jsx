import React from 'react';
import InsuranceModifier from './InsuranceModifier';
import InsuranceEstimatedRevenue from './InsuranceEstimatedRevenue';

const InsuranceTab = props => {
  const { insurance, insuranceRequest } = props;
  return (
    <div>
      <InsuranceEstimatedRevenue
        insurance={insurance}
        insuranceRequest={insuranceRequest}
      />
      <InsuranceModifier
        insuranceRequest={insuranceRequest}
        insurance={insurance}
      />
    </div>
  );
};

export default InsuranceTab;
