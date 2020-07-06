import React from 'react';
import cx from 'classnames';

import { taskComplete, taskUpdate } from 'core/api/tasks/methodDefinitions';
import { TASK_PRIORITIES } from 'core/api/tasks/taskConstants';
import IconButton from 'core/components/IconButton';

import TaskSnoozer from './TaskSnoozer';

const TasksTableActions = ({ taskId, priority }) => (
  <div className="flex">
    <IconButton
      onClick={e => {
        e.stopPropagation();
        taskComplete.run({ taskId });
      }}
      size="small"
      type="check"
      tooltip="Compléter tâche"
      className="success mr-4"
    />
    <TaskSnoozer taskId={taskId} buttonProps={{ className: 'mr-4' }} />
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
