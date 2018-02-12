import query from "core/api/users/queries/tasksUsersList";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import TasksAssignedUserDropdown from "./TasksAssignedUserDropdown";

const TasksUsersContainer = withQuery(() => query.clone(), {
    reactive: true
})(TasksAssignedUserDropdown);

export default TasksUsersContainer;