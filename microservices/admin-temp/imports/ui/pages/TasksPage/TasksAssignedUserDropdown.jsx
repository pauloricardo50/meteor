import React from 'react';
import DropdownMenu from 'core/components/DropdownMenu/';
import { callMutation, mutations } from 'core/api';

const firstUserAssign = ({
  taskAssignedTo,
  relatedUserId,
  user,
  taskId,
  taskType,
}) => {
  if (!taskAssignedTo) {
    callMutation(mutations.ASSIGN_ADMIN_TO_NEW_USER_TASK, {
      userId: relatedUserId,
      adminId: user._id,
      taskId,
      taskType,
    });
  } else {
    callMutation(mutations.TASK_CHANGE_ASSIGNED_TO, {
      taskId,
      newAssignee: user._id,
    });
  }
};

const changeAssignedUser = ({ user, task, taskAssignedTo }) => {
  const taskUserId = task.user ? task.user._id : undefined;
  if (!taskUserId) {
    callMutation(mutations.TASK_GET_RELATED_TO, {
      task,
    }).then((relatedUserId) => {
      firstUserAssign({
        taskAssignedTo,
        relatedUserId,
        user,
        taskId: task._id,
        taskType: task.type,
      });
    });
  } else {
    firstUserAssign({
      taskAssignedTo,
      relatedUserId: taskUserId,
      user,
      taskId: task._id,
      taskType: task.type,
    });
  }
};

const getMenuItems = (users, task) => {
  const taskAssignedTo = task.assignedUser ? task.assignedUser._id : undefined;
  const options = users.map(user => ({
    id: user._id,
    show: user._id !== taskAssignedTo,
    label: user.emails[0].address,
    link: false,
    onClick: () => {
      changeAssignedUser({
        user,
        task,
        taskAssignedTo,
      });
    },
  }));
  return options;
};

const TasksAssignedUserDropdown = (props) => {
  const { data, isLoading, error, task, styles } = props;

  if (isLoading) {
    return null;
  }
  if (error) {
    return <div>Error: {error.reason}</div>;
  }

  return (
    <DropdownMenu
      iconType="personAdd"
      options={getMenuItems(data, task)}
      style={styles}
    />
  );
};

export default TasksAssignedUserDropdown;
