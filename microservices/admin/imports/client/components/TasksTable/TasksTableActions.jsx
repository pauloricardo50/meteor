// @flow
import React from 'react';
import cx from 'classnames';

import { TASK_STATUS, TASK_PRIORITIES } from 'core/api/constants';
import IconButton from 'core/components/IconButton';
import {
  taskComplete,
  taskChangeStatus,
  taskUpdate,
} from 'core/api/tasks/index';

type TasksTableActionsProps = {};

const TasksTableActions = ({ taskId, priority }: TasksTableActionsProps) => (
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
