import React, { useState, useEffect } from 'react';

import RevenueAdder from '../../../../components/RevenuesTable/RevenueAdder';
import RevenuesTable from '../../../../components/RevenuesTable';
import RevenueSuggestions from './RevenueSuggestions';
import LoanAssigneeManager from './LoanAssigneeManager';

const RevenuesTab = ({ loan }) => {
  const [revenueSuggestion, setRevenueSuggestion] = useState();
  const [open, setOpen] = useState(false);

  const suggestRevenue = revenue => {
    setRevenueSuggestion(revenue);
    setOpen(true);
  };

  useEffect(() => {
    if (open === false) {
      setRevenueSuggestion();
    }
  }, [open]);

  return (
    <div className="revenues-tab">
      <div className="flex center-align">
        <h2 className="mr-8">Revenus</h2>
        <RevenueAdder
          loan={loan}
          revenue={revenueSuggestion}
          open={open}
          setOpen={setOpen}
        />
      </div>
      <LoanAssigneeManager loan={loan} />
      <RevenueSuggestions loan={loan} suggestRevenue={suggestRevenue} />
      <RevenuesTable
        displayActions
        loan={loan}
        filterRevenues={({ loan: { _id: loanId } }) => ({ loanId })}
      />
    </div>
  );
};

export default RevenuesTab;
