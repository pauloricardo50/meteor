import React from 'react';
import RevenuesTable from '../../../../components/RevenuesTable';

const RevenuesTab = ({ insuranceRequest }) => (
  <div className="flex-col">
    <h3>Revenus</h3>
    <RevenuesTable
      insuranceRequest={insuranceRequest}
      filterRevenues={({ insuranceRequest: { _id: insuranceRequestId } }) => ({
        'insuranceRequestCache.0._id': insuranceRequestId,
      })}
      firstColumnLabel="Assurance"
    />
  </div>
);

export default RevenuesTab;
