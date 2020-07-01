import React from 'react';

import { taskSnooze } from 'core/api/tasks/methodDefinitions';
import DropdownMenu from 'core/components/DropdownMenu';

const TaskSnoozer = ({ taskId, buttonProps }) => (
  <DropdownMenu
    buttonProps={{
      type: 'snooze',
      size: 'small',
      tooltip: 'Snoozer',
      ...buttonProps,
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
);

export default TaskSnoozer;
