import { createContainer } from 'core/api';
import {
  assignAdminToNewUser,
  taskChangeAssignedTo,
  taskGetRelatedTo,
} from 'core/api/methods';
import AssignAdminDropdown from './AssignAdminDropdown';

const firstUserAssign = ({
  taskAssignedTo,
  relatedUserId,
  admin,
  taskId,
  taskType,
}) => {
  if (!taskAssignedTo) {
    assignAdminToNewUser.run({
      userId: relatedUserId,
      adminId: admin._id,
      taskId,
      taskType,
    });
  } else {
    taskChangeAssignedTo.run({
      taskId,
      newAssignee: admin._id,
    });
  }
};

const changeAssignedUser = ({ admin, task, taskAssignedTo }) => {
  const taskUserId = task.user ? task.user._id : undefined;
  if (!taskUserId) {
    taskGetRelatedTo.run({ task }).then(relatedUserId =>
      firstUserAssign({
        taskAssignedTo,
        relatedUserId,
        admin,
        taskId: task._id,
        taskType: task.type,
      }));
  } else {
    firstUserAssign({
      taskAssignedTo,
      relatedUserId: taskUserId,
      admin,
      taskId: task._id,
      taskType: task.type,
    });
  }
};

const onAdminSelectHandler = ({ selectedAdmin, relatedDoc, currentAdmin }) =>
  changeAssignedUser({
    admin: selectedAdmin,
    task: relatedDoc,
    taskAssignedTo: currentAdmin,
  });

const TaskAssignDropdownContainer = createContainer(() => ({
  onAdminSelectHandler,
}));

export default TaskAssignDropdownContainer(AssignAdminDropdown);
