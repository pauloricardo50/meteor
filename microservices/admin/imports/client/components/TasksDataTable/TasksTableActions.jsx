import React from 'react';
import cx from 'classnames';

import {
  taskComplete,
  taskSnooze,
  taskUpdate,
} from 'core/api/tasks/methodDefinitions';
import { TASK_PRIORITIES } from 'core/api/tasks/taskConstants';
import DropdownMenu from 'core/components/DropdownMenu/DropdownMenu';
import IconButton from 'core/components/IconButton';

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
    <DropdownMenu
      buttonProps={{
        type: 'snooze',
        size: 'small',
        className: 'mr-4',
        tooltip: 'Snoozer',
      }}
      options={[
        {
          label: 'À 8h du matin',
          disabled: true,
        },
        {
          label: '+1j ouvrable',
          onClick: () => taskSnooze.run({ taskId, workingDays: 1 }),
        },
        {
          label: '+3j ouvrables',
          onClick: () => taskSnooze.run({ taskId, workingDays: 3 }),
        },
        {
          label: '+5j ouvrables',
          onClick: () => taskSnooze.run({ taskId, workingDays: 5 }),
        },
      ]}
      noWrapper
      menuProps={{
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        transformOrigin: { vertical: 'top', horizontal: 'right' },
      }}
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
