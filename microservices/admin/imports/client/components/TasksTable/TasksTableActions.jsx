// @flow
import React from 'react';

import { TASK_STATUS } from 'core/api/constants';
import IconButton from 'core/components/IconButton';
import { taskComplete, taskChangeStatus } from 'core/api/tasks/index';

type TasksTableActionsProps = {};

const TasksTableActions = ({ taskId }: TasksTableActionsProps) => (
  <div className="flex space-children">
    <IconButton
      onClick={(e) => {
        e.stopPropagation();
        taskComplete.run({ taskId });
      }}
      size="small"
      type="check"
      tooltip="Compléter tâche"
      className="success"
    />
    <IconButton
      onClick={(e) => {
        e.stopPropagation();
        taskChangeStatus.run({
          taskId,
          newStatus: TASK_STATUS.CANCELLED,
        });
      }}
      size="small"
      type="close"
      tooltip="Annuler tâche"
      className="error"
    />
  </div>
);

export default TasksTableActions;
