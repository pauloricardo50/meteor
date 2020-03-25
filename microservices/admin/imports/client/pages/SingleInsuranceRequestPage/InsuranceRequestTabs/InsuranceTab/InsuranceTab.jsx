import React from 'react';
import InsuranceModifier from './InsuranceModifier';
import InsuranceEstimatedRevenue from './InsuranceEstimatedRevenue';
import RevenuesTable from '../../../../components/RevenuesTable';

const InsuranceTab = props => {
  const { insurance, insuranceRequest } = props;
  const { revenues = [] } = insurance;
  return (
    <div className="flex-col">
      <div className="flex-col card1 p-16 mb-32">
        <h3 className="mt-0">Revenus</h3>
        {revenues.length ? (
          <RevenuesTable
            insurance={insurance}
            filterRevenues={({ insurance: { _id: insuranceId } }) => ({
              insuranceId,
            })}
          />
        ) : (
          <InsuranceEstimatedRevenue
            insurance={insurance}
            insuranceRequest={insuranceRequest}
          />
        )}
      </div>

      <div className="flex-col card1 p-16">
        <h3 className="mt-0">{insurance.name}</h3>
        <InsuranceModifier
          insuranceRequest={insuranceRequest}
          insurance={insurance}
        />
      </div>
    </div>
  );
};

export default InsuranceTab;
