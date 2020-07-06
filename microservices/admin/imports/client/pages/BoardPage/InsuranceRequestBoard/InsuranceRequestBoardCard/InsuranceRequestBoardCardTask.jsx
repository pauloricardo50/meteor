import React, { useState } from 'react';

import { taskComplete } from 'core/api/tasks/methodDefinitions';
import IconButton from 'core/components/IconButton';

import TaskSnoozer from '../../../../components/TasksDataTable/TaskSnoozer';

const InsuranceRequestBoardCardTask = ({ title = 'Tâche sans titre', _id }) => {
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
          <TaskSnoozer
            taskId={_id}
            buttonProps={{ className: 'task-snooze-button', size: 'tiny' }}
          />
        </span>
      )}
    </span>
  );
};

export default InsuranceRequestBoardCardTask;
