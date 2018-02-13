import PropTypes from "prop-types";
import React from "react";
import { Meteor } from "meteor/meteor";
import { Roles } from "meteor/alanning:roles";
import { TASK_STATUS } from "core/api/tasks/tasksConstants";
import { T } from "core/components/Translation/";
import DropdownMenu from "core/components/DropdownMenu/";
import { changeTaskStatus } from "core/api/tasks/methods";

const changeStatus = (status, taskId) => {
    changeTaskStatus.call({
        taskId: taskId,
        newStatus: status
    });
};

const getMenuItems = (taskId, taskStatus) => {
    const statuses = Object.values(TASK_STATUS);
    const options = statuses.map(status => ({
        id: status,
        show: status != taskStatus
    }));

    return options;
};

const TasksDropdown = props => {
    const { currentUser, history, taskId, taskStatus, styles } = props;

    return (
        <DropdownMenu
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left"
            }}
            transformOrigin={{
                vertical: "bottom",
                horizontal: "left"
            }}
            iconType="offlinePin"
            options={getMenuItems(taskId, taskStatus)
                // Allow the Divider to go through
                .filter(o => !!o.show)
                .map(({ id: optionId, label, ...rest }) => ({
                    ...rest,
                    id: optionId,
                    link: false,
                    onClick: () => {
                        changeStatus(optionId, taskId);
                    },
                    label: label || <T id={`TasksStatusDropdown.${optionId}`} />
                }))}
            style={styles}
        />
    );
};

TasksDropdown.propTypes = {
    history: PropTypes.object.isRequired
};

export default TasksDropdown;
