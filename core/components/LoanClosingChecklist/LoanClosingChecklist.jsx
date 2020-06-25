import { Meteor } from 'meteor/meteor';

import React from 'react';
import { faClipboardListCheck } from '@fortawesome/pro-duotone-svg-icons/faClipboardListCheck';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { getCompletionRate } from '../../api/checklists/checklistHelpers';
import { loanUpdate } from '../../api/loans/methodDefinitions';
import colors from '../../config/colors';
import Checklist from '../Checklist';
import { withChecklistContext } from '../Checklist/ChecklistContext';
import DialogSimple from '../DialogSimple';
import { FaIcon } from '../Icon';
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
      text={
        <div>
          <div className="text-center mb-32 animated fadeIn">
            <FaIcon
              icon={faClipboardListCheck}
              color={completion.percent >= 1 ? colors.success : colors.primary}
              size="8x"
            />
          </div>
          {!isAdmin &&
            "Avançons ensemble jusqu'à la concrétisation de votre projet."}
        </div>
      }
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
