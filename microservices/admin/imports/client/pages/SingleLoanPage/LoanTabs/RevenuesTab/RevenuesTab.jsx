import React from 'react';

import RevenueAdder from './RevenueAdder';
import RevenuesTable from './RevenuesTable';

const RevenuesTab = ({ loan }) => (
  <div className="revenues-tab">
    <h2>Revenus</h2>
    <RevenueAdder loan={loan} />
    <RevenuesTable
      loan={loan}
      filterRevenues={({ loan: { _id: loanId } }) => ({ loanId })}
    />
  </div>
);

export default RevenuesTab;
