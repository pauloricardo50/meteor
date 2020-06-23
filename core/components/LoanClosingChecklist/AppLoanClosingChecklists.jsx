import React from 'react';

import { CHECKLIST_ITEM_ACCESS } from '../../api/checklists/checklistConstants';
import { loanChecklists } from '../../api/checklists/queries';
import useMeteorData from '../../hooks/useMeteorData';
import LoanClosingChecklist from './LoanClosingChecklist';

const AppLoanClosingChecklists = ({ loan, renderTrigger }) => {
  const { data: checklists, loading } = useMeteorData({
    query: loanChecklists,
    params: {
      loanId: loan._id,
      $body: {
        title: 1,
        description: 1,
        items: 1,
      },
    },
    reactive: true,
  });

  if (loading) {
    return null;
  }

  const filteredChecklists = checklists.map(({ items, ...checklist }) => ({
    ...checklist,
    items: items.filter(({ access }) => access === CHECKLIST_ITEM_ACCESS.USER),
  }));

  return (
    <LoanClosingChecklist
      checklists={filteredChecklists}
      renderTrigger={renderTrigger}
      loan={loan}
    />
  );
};

export default AppLoanClosingChecklists;
