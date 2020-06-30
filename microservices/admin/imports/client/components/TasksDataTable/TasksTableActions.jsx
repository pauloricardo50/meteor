import React from 'react';
import cx from 'classnames';

import { taskComplete, taskUpdate } from 'core/api/tasks/methodDefinitions';
import { TASK_PRIORITIES } from 'core/api/tasks/taskConstants';
import IconButton from 'core/components/IconButton';

const TasksTableActions = ({ taskId, priority }) => (
  <div className="flex space-children">
    <IconButton
      onClick={e => {
        e.stopPropagation();
        taskComplete.run({ taskId });
      }}
      size="small"
      type="check"
      tooltip="Compléter tâche"
      className="success"
    />
    <IconButton
      onClick={e => {
        e.stopPropagation();
        taskUpdate.run({
          taskId,
          object: {
            priority:
              priority === TASK_PRIORITIES.HIGH
                ? TASK_PRIORITIES.DEFAULT
                : TASK_PRIORITIES.HIGH,
          },
        });
      }}
      size="small"
      type="priorityHigh"
      tooltip="Rendre tâche prioritaire"
      className={cx({ warning: priority === TASK_PRIORITIES.HIGH })}
    />
  </div>
);

export default TasksTableActions;
