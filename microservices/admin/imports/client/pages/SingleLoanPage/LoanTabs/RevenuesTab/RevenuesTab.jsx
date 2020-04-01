import React, { useState, useEffect } from 'react';

import { LOANS_COLLECTION } from 'core/api/constants';
import RevenueAdder from '../../../../components/RevenuesTable/RevenueAdder';
import RevenuesTable from '../../../../components/RevenuesTable';
import AssigneesManager from '../../../../components/AssigneesManager';
import RevenueSuggestions from './RevenueSuggestions';

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
      <AssigneesManager doc={loan} collection={LOANS_COLLECTION} />
      <RevenueSuggestions loan={loan} suggestRevenue={suggestRevenue} />
      <RevenuesTable
        loan={loan}
        filterRevenues={({ loan: { _id: loanId, insuranceRequests = [] } }) => {
          if (insuranceRequests.length) {
            return {
              $or: [
                { 'loanCache.0._id': loanId },
                {
                  'insuranceRequestCache.0._id': {
                    $in: insuranceRequests.map(({ _id }) => _id),
                  },
                },
              ],
            };
          }
          return { 'loanCache.0._id': loanId };
        }}
      />
    </div>
  );
};

export default RevenuesTab;
