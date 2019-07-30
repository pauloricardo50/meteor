import React from 'react';

import RevenueAdder from '../../../../components/RevenuesTable/RevenueAdder';
import RevenuesTable from '../../../../components/RevenuesTable';

const RevenuesTab = ({ loan }) => (
  <div className="revenues-tab">
    <h2>Revenus</h2>
    <RevenueAdder loan={loan} />
    <RevenuesTable
      displayActions
      loan={loan}
      filterRevenues={({ loan: { _id: loanId } }) => ({ loanId })}
    />
  </div>
);

export default RevenuesTab;
