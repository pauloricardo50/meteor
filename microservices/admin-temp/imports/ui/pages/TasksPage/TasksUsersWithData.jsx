import query from 'core/api/users/queries/admins';
import { withQuery } from 'meteor/cultofcoders:grapher-react';
import TasksAssignedUserDropdown from './TasksAssignedUserDropdown';

const TasksUsersWithData = withQuery(() => query.clone(), {
    reactive: true
})(TasksAssignedUserDropdown);

export default TasksUsersWithData;
