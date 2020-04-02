import React from 'react';

import { taskChangeStatus } from 'core/api/tasks/methodDefinitions';
import { TASK_STATUS } from 'core/api/tasks/taskConstants';
import DropdownMenu from 'core/components/DropdownMenu/';
import T from 'core/components/Translation/';

const changeStatus = (status, taskId) => {
  taskChangeStatus.run({ taskId, newStatus: status });
};

const getMenuItems = (taskId, taskStatus) => {
  const statuses = Object.values(TASK_STATUS);
  const options = statuses.map(status => ({
    id: status,
    show: status !== taskStatus,
    link: false,
    onClick: () => changeStatus(status, taskId),
    label: <T id={`TaskStatusSetter.${status}`} />,
  }));

  return options;
};

const TaskStatusSetter = props => {
  const { taskId, taskStatus, styles } = props;

  return (
    <DropdownMenu
      iconType="offlinePin"
      options={getMenuItems(taskId, taskStatus)}
      style={styles}
      tooltip={<T id="TaskStatusSetter.changeTaskStatus" />}
    />
  );
};

TaskStatusSetter.propTypes = {};

export default TaskStatusSetter;
