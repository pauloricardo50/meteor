import { createContainer } from 'core/api';
import {
  assignAdminToNewUser,
  taskChangeAssignedTo,
  taskGetRelatedTo,
} from 'core/api/methods';
import AssignAdminDropdown from './AssignAdminDropdown';
// import AssignAdminDropdownContainer from './AssignAdminDropdownContainer';

const TaskAssignDropdownContainer = createContainer((props) => {
  console.log('TaskAssignDropdownContainer');
  const firstUserAssign = ({
    taskAssignedTo,
    relatedUserId,
    admin,
    taskId,
    taskType,
  }) => {
    console.log('firstUserAssign');
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
    console.log('changeAssignedUser');
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

  return onAdminSelectHandler;
});

export default TaskAssignDropdownContainer(AssignAdminDropdown);
