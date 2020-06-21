import React from 'react';

import { getCompletionRate } from '../../api/checklists/checklistHelpers';
import DialogSimple from '../DialogSimple';
import T from '../Translation';
import Checklist from './Checklist';

const LoanClosingChecklist = ({ checklists, renderTrigger }) => {
  const { done, total } = getCompletionRate(checklists);
  return (
    <DialogSimple
      closeOnly
      renderTrigger={renderTrigger}
      title={
        <div>
          <T id="LoanClosingChecklist.dialogTitle" />
          &nbsp;({done}/{total})
        </div>
      }
      openOnMount
      maxWidth={false}
    >
      <div className="flex">
        {checklists.map(checklist => (
          <Checklist key={checklist._id} checklist={checklist} />
        ))}
      </div>
    </DialogSimple>
  );
};

export default LoanClosingChecklist;
