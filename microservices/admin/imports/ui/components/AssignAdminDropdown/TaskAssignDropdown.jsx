import { createContainer } from 'core/api';
import {
  assignAdminToNewUser,
  taskChangeAssignedTo,
  taskGetRelatedTo,
} from 'core/api/methods';
import AssignAdminDropdown from './AssignAdminDropdown';

const assignEmployeeToTask = ({
  taskAssignedTo,
  relatedUserId,
  admin,
  taskId,
}) => {
  if (!taskAssignedTo) {
    // if taskAssignedTo is not defined, it's the first assignment for
    // that user, since after that (the initial assignment), all new tasks
    // related to that user will be automatically assigned, and therefore,
    // taskAssignedTo will be defined
    assignAdminToNewUser.run({
      userId: relatedUserId,
      adminId: admin._id,
    });
  } else {
    taskChangeAssignedTo.run({
      taskId,
      newAssignee: admin._id,
    });
  }
};

const changeAssignedEmployee = ({ admin, task, taskAssignedTo }) => {
  const taskUserId = task.user ? task.user._id : undefined;
  if (!taskUserId) {
    taskGetRelatedTo.run({ task }).then(relatedUserId =>
      assignEmployeeToTask({
        taskAssignedTo,
        relatedUserId,
        admin,
        taskId: task._id,
        taskType: task.type,
      }));
  } else {
    assignEmployeeToTask({
      taskAssignedTo,
      relatedUserId: taskUserId,
      admin,
      taskId: task._id,
      taskType: task.type,
    });
  }
};

const onAdminSelectHandler = ({ selectedAdmin, relatedDoc, currentAdmin }) =>
  changeAssignedEmployee({
    admin: selectedAdmin,
    task: relatedDoc,
    taskAssignedTo: currentAdmin,
  });

const TaskAssignDropdownContainer = createContainer(() => ({
  onAdminSelectHandler,
}));

export default TaskAssignDropdownContainer(AssignAdminDropdown);
