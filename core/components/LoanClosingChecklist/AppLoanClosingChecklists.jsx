import React from 'react';

import { CHECKLIST_ITEM_ACCESS } from '../../api/checklists/checklistConstants';
import { loanChecklists } from '../../api/checklists/queries';
import useMeteorData from '../../hooks/useMeteorData';
import LoanClosingChecklist from './LoanClosingChecklist';

const AppLoanClosingChecklists = ({ loanId, renderTrigger }) => {
  const { data: checklists, loading } = useMeteorData({
    query: loanChecklists,
    params: {
      loanId,
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
      loanId={loanId}
    />
  );
};

export default AppLoanClosingChecklists;
