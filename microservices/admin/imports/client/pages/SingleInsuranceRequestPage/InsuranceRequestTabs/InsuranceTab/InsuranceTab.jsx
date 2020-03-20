import React from 'react';
import InsuranceModifier from './InsuranceModifier';
import InsuranceEstimatedRevenue from './InsuranceEstimatedRevenue';
import RevenuesTable from '../../../../components/RevenuesTable';

const InsuranceTab = props => {
  const { insurance, insuranceRequest } = props;
  const { revenues = [] } = insurance;
  return (
    <div>
      {revenues.length ? (
        <div className="flex-col mb-32">
          <h3>Revenus</h3>
          <RevenuesTable
            insurance={insurance}
            filterRevenues={({ insurance: { _id: insuranceId } }) => ({
              insuranceId,
            })}
          />
        </div>
      ) : (
        <InsuranceEstimatedRevenue
          insurance={insurance}
          insuranceRequest={insuranceRequest}
        />
      )}
      <InsuranceModifier
        insuranceRequest={insuranceRequest}
        insurance={insurance}
      />
    </div>
  );
};

export default InsuranceTab;
