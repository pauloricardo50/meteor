import React from 'react';
import DropdownMenu from 'core/components/DropdownMenu/';
import { callMutation, mutations } from 'core/api';
import { TASK_STATUS } from 'core/api/tasks/tasksConstants';

const firstUserAssign = ({ taskAssignedTo, relatedUserId, user, taskId }) => {
  if (!taskAssignedTo) {
    callMutation(mutations.ASSIGN_ADMIN_TO_USER, {
      userId: relatedUserId,
      adminId: user._id,
    })
      .then((nbOfAffectedRows) => {
        if (nbOfAffectedRows > 0) {
          callMutation(mutations.TASK_CHANGE_ASSIGNED_TO, {
            taskId,
            newAssignee: user._id,
          });
        }
      })
      .then((nbOfAffectedRows) => {
        if (nbOfAffectedRows > 0) {
          callMutation(mutations.TASK_CHANGE_STATUS, {
            taskId,
            newStatus: TASK_STATUS.COMPLETED,
          });
        }
      });
  } else {
    callMutation(mutations.TASK_CHANGE_ASSIGNED_TO, {
      taskId,
      newAssignee: user._id,
    });
  }
};

const changeAssignedUser = ({
  user,
  task,
  taskAssignedTo,
}) => {
  const taskId = task._id;
  const taskUserId = task.user ? task.user._id : undefined;
  if (!taskUserId) {
    callMutation(mutations.TASK_GET_RELATED_TO, {
      task,
    }).then((relatedUserId) => {
      firstUserAssign({ taskAssignedTo, relatedUserId, user, taskId });
    });
  } else {
    firstUserAssign({ taskAssignedTo, taskUserId, user, taskId });
  }
};

const getMenuItems = (
  users,
  task,
) => {
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
  const {
    data,
    isLoading,
    error,
    task,
    styles,
  } = props;

  if (isLoading) {
    return null;
  }
  if (error) {
    return <div>Error: {error.reason}</div>;
  }

  return (
    <DropdownMenu
      iconType="personAdd"
      options={getMenuItems(
        data,
        task,
      )}
      style={styles}
    />
  );
};

export default TasksAssignedUserDropdown;
