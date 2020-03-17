import React from 'react';
import InsuranceModifier from './InsuranceModifier';

const InsuranceTab = props => {
  console.log(props);
  const { insurance, insuranceRequest } = props;
  return (
    <div>
      <InsuranceModifier
        insuranceRequest={insuranceRequest}
        insurance={insurance}
      />
    </div>
  );
};

export default InsuranceTab;
