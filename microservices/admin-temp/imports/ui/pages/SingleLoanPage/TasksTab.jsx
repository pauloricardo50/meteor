import React from "react";
import TasksTable from "../TasksPage/TasksTable";

export default class TasksTab extends React.Component {
    constructor(props) {
        super(props);

        this.state = { showObject: false };
    }

    render() {
        const { loan, borrowers, property, dataToPassDown } = this.props;
        const { showObject } = this.state;

        return (
            <TasksTable
                data={loan.tasksLink}
                error={this.props.error}
                isLoading={this.props.isLoadin}
                showAssignee={true}
            />
        );
    }
}
