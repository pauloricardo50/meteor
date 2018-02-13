import PropTypes from "prop-types";
import React, { Component } from "react";
import { Roles } from "meteor/alanning:roles";
import moment from "moment";
import Table from "core/components/Table";
import TasksStatusDropdown from "./TasksStatusDropdown";
import TasksUserContainer from "./TasksUsersContainer";
import { T } from "../../../core/components/Translation/";

const styles = {
    dropdownButtons: { display: "inline", width: "50%" }
};

const getColumnOptions = ({ showAssignee }) => {
    if (showAssignee) {
        return [
            { id: "#", style: { width: 32, textAlign: "left" } },
            {
                id: <T id={`TasksTable.status`} />,
                style: { textAlign: "left" }
            },
            {
                id: <T id={`TasksTable.createdAt`} />,
                style: { textAlign: "left" }
            },
            {
                id: <T id={`TasksTable.updatedAt`} />,
                style: { textAlign: "left" }
            },
            {
                id: <T id={`TasksTable.dueAt`} />,
                style: { textAlign: "left" }
            },
            {
                id: <T id={`TasksTable.completedAt`} />,
                style: { textAlign: "left" }
            },
            {
                id: <T id={`TasksTable.asignedTo`} />,
                style: { textAlign: "left" }
            },
            {
                id: <T id={`TasksTable.actions`} />,
                style: { textAlign: "left" }
            }
        ];
    } else {
        return [
            { id: "#", style: { width: 32, textAlign: "left" } },
            {
                id: <T id={`TasksTable.status`} />,
                style: { textAlign: "left" }
            },
            {
                id: <T id={`TasksTable.createdAt`} />,
                style: { textAlign: "left" }
            },
            {
                id: <T id={`TasksTable.updatedAt`} />,
                style: { textAlign: "left" }
            },
            { id: <T id={`TasksTable.dueAt`} />, style: { textAlign: "left" } },
            {
                id: <T id={`TasksTable.completedAt`} />,
                style: { textAlign: "left" }
            },
            {
                id: <T id={`TasksTable.actions`} />,
                style: { textAlign: "left" }
            }
        ];
    }
};

export default class TasksTable extends Component {
    constructor(props) {
        super(props);
        this.state = { rows: this.setupRows(this.props) };
    }

    componentWillReceiveProps(nextProps) {
        let newRows = this.setupRows(nextProps);
        this.setState({ rows: newRows });
    }

    setupRows = props => {
        const tasks = props.data;

        if (props.showAsignee) {
            this.rows = tasks.map((task, index) => ({
                id: task._id,
                columns: [
                    index + 1,
                    task.status,
                    moment(task.createdAt).format("D MMM YY à HH:mm:ss"),
                    moment(task.updatedAt).format("D MMM YY à HH:mm:ss"),
                    moment(task.dueAt).format("D MMM YY à HH:mm:ss"),
                    moment(task.completedAt).format("D MMM YY à HH:mm:ss"),
                    (task.assignedUser && task.assignedUser.username) ||
                        (task.assignedUser &&
                            task.assignedUser.emails[0].address.toString()) ||
                        "",
                    <div>
                        <TasksStatusDropdown
                            {...this.props}
                            currentUser={Meteor.user()}
                            taskId={task._id}
                            taskStatus={task.status}
                            styles={styles.dropdownButtons}
                        />
                        <TasksUserContainer
                            {...this.props}
                            taskId={task._id}
                            taskUser={task.user}
                            styles={styles.dropdownButtons}
                        />
                    </div>
                ]
            }));
        } else {
            this.rows = tasks.map((task, index) => ({
                id: task._id,
                columns: [
                    index + 1,
                    task.status,
                    moment(task.createdAt).format("D MMM YY à HH:mm:ss"),
                    moment(task.updatedAt).format("D MMM YY à HH:mm:ss"),
                    moment(task.dueAt).format("D MMM YY à HH:mm:ss"),
                    moment(task.completedAt).format("D MMM YY à HH:mm:ss"),
                    <div>
                        <TasksStatusDropdown
                            {...this.props}
                            currentUser={Meteor.user()}
                            taskId={task._id}
                            taskStatus={task.status}
                            styles={styles.dropdownButtons}
                        />
                        <TasksUserContainer
                            {...this.props}
                            taskId={task._id}
                            taskUser={task.user}
                            styles={styles.dropdownButtons}
                        />
                    </div>
                ]
            }));
        }

        return this.rows;
    };

    render() {
        const columnOptions = getColumnOptions({
            showAssignee: this.props.showAsignee
        });

        if (!this.props.isLoading) {
            return (
                <Table
                    columnOptions={columnOptions}
                    rows={this.state.rows}
                    noIntl
                />
            );
        } else {
            return null;
        }
    }
}

TasksTable.propTypes = {
    history: PropTypes.objectOf(PropTypes.any).isRequired
};
