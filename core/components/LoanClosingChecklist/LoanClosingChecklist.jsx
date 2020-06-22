import { Meteor } from 'meteor/meteor';

import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { getCompletionRate } from '../../api/checklists/checklistHelpers';
import { loanUpdate } from '../../api/loans/methodDefinitions';
import Checklist from '../Checklist';
import { withChecklistContext } from '../Checklist/ChecklistContext';
import DialogSimple from '../DialogSimple';
import Toggle from '../Toggle/Toggle';
import T from '../Translation';

const isAdmin = Meteor.microservice === 'admin';

const LoanClosingChecklist = ({
  loan,
  checklists,
  renderTrigger,
  openOnMount,
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
          &nbsp;
          <span className="secondary">
            ({completion.done}/{completion.total})
          </span>
        </div>
      }
      maxWidth={false}
      openOnMount={openOnMount}
    >
      <DndProvider backend={HTML5Backend}>
        {isAdmin && (
          <Toggle
            toggled={loan.showClosingChecklists}
            onToggle={() =>
              loanUpdate.run({
                loanId: loan._id,
                object: { showClosingChecklists: !loan.showClosingChecklists },
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
      </DndProvider>
    </DialogSimple>
  );
};

export default withChecklistContext(({ loan }) => ({ uploaderDoc: loan }))(
  LoanClosingChecklist,
);
