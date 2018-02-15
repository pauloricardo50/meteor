import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { T } from 'core/components/Translation/';
import DropdownMenu from 'core/components/DropdownMenu/';
import { changeTaskUser } from 'core/api/tasks/methods';

const changeAssignedUser = (user, taskId) => {
    changeTaskUser.call({
        taskId: taskId,
        newUser: user
    });
};

const getMenuItems = (users, taskUser) => {
    const options = users.map(user => ({
        id: user._id,
        show: user._id != taskUser,
        label: user.emails[0].address,
        link: false,
        onClick: () => {
            changeAssignedUser(user._id, taskId);
        }
    }));
    return options;
};

const TasksAssignedUserDropdown = props => {
    const { data, isLoading, error, history, taskId, taskUser, styles } = props;

    if (isLoading) {
        return null;
    }
    if (error) {
        return <div>Error: {error.reason}</div>;
    }

    return (
        <DropdownMenu
            iconType="personAdd"
            options={getMenuItems(data, taskUser)}
            style={styles}
        />
    );
};

export default TasksAssignedUserDropdown;
