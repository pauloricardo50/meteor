//      
import React, { useState } from 'react';

import IconButton from 'core/components/IconButton';
import { taskComplete, taskChangeStatus } from 'core/api/tasks/index';
import { TASK_STATUS } from 'core/api/constants';

                                 

const LoanBoardCardTask = ({
  title = 'Tâche sans titre',
  _id,
}                        ) => {
  const [showButtons, setShowButtons] = useState(false);
  return (
    <span
      onMouseEnter={() => setShowButtons(true)}
      onMouseLeave={() => setShowButtons(false)}
      className="loan-board-card-task"
    >
      {title}
      {showButtons && (
        <span className="buttons">
          <IconButton
            onClick={e => {
              e.stopPropagation();
              taskComplete.run({ taskId: _id });
            }}
            size="tiny"
            type="check"
            tooltip="Compléter tâche"
            className="task-complete-button"
          />
          <IconButton
            onClick={e => {
              e.stopPropagation();
              taskChangeStatus.run({
                taskId: _id,
                newStatus: TASK_STATUS.CANCELLED,
              });
            }}
            size="tiny"
            type="close"
            tooltip="Annuler tâche"
            className="task-cancel-button"
          />
        </span>
      )}
    </span>
  );
};

export default LoanBoardCardTask;
