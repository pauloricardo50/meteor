import { createContainer } from 'core/api';
import {
  assignAdminToNewUser,
  setAssigneeOfTask,
  taskGetRelatedTo,
} from 'core/api/methods';
import AssignAdminDropdown from './AssignAdminDropdown';

const onAdminSelectHandler = ({ newAdmin, relatedDoc, oldAdmin }) => {
  const task = relatedDoc;
  const taskUserId = task.user ? task.user._id : undefined;

  if (oldAdmin) {
    // not an initial assignment for a new user
    return setAssigneeOfTask.run({
      taskId: task._id,
      newAssigneeId: newAdmin._id,
    });
  }

  // New user initial assignment:
  // if oldAdmin ( assignedEmployeeId) is not defined, it's the first
  // assignment for that user, since after that (the initial assignment),
  // all new tasks related to that user will be automatically assigned,
  // and therefore, oldAdmin will be defined

  if (!taskUserId) {
    // task is not related 'directly' to a user, so we need to get
    // the doc that it relates to and it's corresponding userId

    return taskGetRelatedTo.run({ task }).then(relatedUserId =>
      assignAdminToNewUser.run({
        userId: relatedUserId,
        adminId: newAdmin._id,
      }));
  }

  return assignAdminToNewUser.run({
    userId: taskUserId,
    adminId: newAdmin._id,
  });
};

const TaskAssignDropdownContainer = createContainer(() => ({
  onAdminSelectHandler,
}));

export default TaskAssignDropdownContainer(AssignAdminDropdown);
