import { Meteor } from 'meteor/meteor';

import React from 'react';

import { getCompletionRate } from '../../api/checklists/checklistHelpers';
import { loanUpdate } from '../../api/loans/methodDefinitions';
import DialogSimple from '../DialogSimple';
import Toggle from '../Toggle/Toggle';
import T from '../Translation';
import Checklist from './Checklist';

const isAdmin = Meteor.microservice === 'admin';

const LoanClosingChecklist = ({
  showClosingChecklists,
  loanId,
  checklists,
  renderTrigger,
}) => {
  const completion = getCompletionRate(checklists);
  return (
    <DialogSimple
      closeOnly
      renderTrigger={({ handleOpen }) =>
        renderTrigger({ handleOpen, ...completion })
      }
      title={
        <div>
          <T id="LoanClosingChecklist.dialogTitle" />
          &nbsp;({completion.done}/{completion.total})
        </div>
      }
      openOnMount
      maxWidth={false}
    >
      <div>
        {isAdmin && (
          <Toggle
            toggled={showClosingChecklists}
            onToggle={() =>
              loanUpdate.run({
                loanId,
                object: { showClosingChecklists: !showClosingChecklists },
              })
            }
            labelRight="Afficher checklist au client"
          />
        )}
        <div className="flex">
          {checklists.map(checklist => (
            <Checklist key={checklist._id} checklist={checklist} />
          ))}
        </div>
      </div>
    </DialogSimple>
  );
};

export default LoanClosingChecklist;
