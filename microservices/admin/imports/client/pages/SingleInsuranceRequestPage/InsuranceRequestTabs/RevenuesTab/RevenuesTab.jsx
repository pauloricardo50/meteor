import React from 'react';
import RevenuesTable from '../../../../components/RevenuesTable';

const RevenuesTab = props => {
  const { insuranceRequest } = props;

  return (
    <div className="flex-col">
      <h3>Revenus</h3>
      <RevenuesTable
        insuranceRequest={insuranceRequest}
        filterRevenues={({
          insuranceRequest: { _id: insuranceRequestId },
        }) => ({ insuranceRequestId })}
        firstColumnLabel="Assurance"
      />
    </div>
  );
};

export default RevenuesTab;
