import React from 'react';
import PropTypes from 'prop-types';

import DropdownMenu from 'core/components/DropdownMenu/';
import { callMutation, mutations } from 'core/api';

const changeAssignedUser = (user, taskId) => {
  callMutation(mutations.TASK_CHANGE_USER, {
    taskId,
    newUser: user,
  });
};

const getMenuItems = (users, taskUser, taskId) => {
  const options = users.map(user => ({
    id: user._id,
    show: user._id !== taskUser,
    label: user.emails[0].address,
    link: false,
    onClick: () => {
      changeAssignedUser(user._id, taskId);
    },
  }));
  return options;
};

const TasksAssignedUserDropdown = (props) => {
  const { data, isLoading, error, taskId, taskUser, styles } = props;

  if (isLoading) {
    return null;
  }
  if (error) {
    return <div>Error: {error.reason}</div>;
  }

  return (
    <DropdownMenu
      iconType="personAdd"
      options={getMenuItems(data, taskUser, taskId)}
      style={styles}
    />
  );
};

export default TasksAssignedUserDropdown;
