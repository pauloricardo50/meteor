import { Meteor } from 'meteor/meteor';

import { SecurityService, Tasks } from '../..';
import { TASK_STATUS, TASK_TYPE } from '../../constants';
import { taskChangeStatus, taskChangeAssignedTo } from '../../methods';
import {
  doesUserExist,
  sendVerificationLink,
  assignAdminToUser,
  assignAdminToNewUser,
  setRole,
} from '../methodDefinitions';
import UserService from '../UserService';

doesUserExist.setHandler((context, { email }) =>
  UserService.doesUserExist({ email }));

sendVerificationLink.setHandler((context, { userId } = {}) => {
  if (userId) {
    SecurityService.checkCurrentUserIsAdmin();
  } else {
    SecurityService.checkLoggedIn();
  }
  const id = userId || Meteor.userId();

  if (Meteor.isDevelopment) {
    console.log(`Not sending verification link in development for userId: ${id}`);
    return false;
  }

  return UserService.sendVerificationEmail({ userId: id });
});

assignAdminToUser.setHandler((context, { userId, adminId }) =>
  UserService.assignAdminToUser({ userId, adminId }));

assignAdminToNewUser.setHandler((context, { userId, adminId, taskId, taskType }) => {
  const assignAdminToUserResult = assignAdminToUser.run({
    userId,
    adminId,
  });
  if (assignAdminToUserResult) {
    SecurityService.tasks.isAllowedToUpdate(taskId);
    const changeTaskAssignedToResult = taskChangeAssignedTo.run({
      taskId,
      newAssignee: adminId,
    });
    if (changeTaskAssignedToResult) {
      // change statuts to "COMPLETED" only for task with type "ADD_ASSIGNED_TO"
      if (taskType === TASK_TYPE.ADD_ASSIGN_TO) {
        taskChangeStatus.run({
          taskId,
          newStatus: TASK_STATUS.COMPLETED,
        });
      } else {
        const assignmentTaskId = Tasks.findOne({
          type: TASK_TYPE.ADD_ASSIGNED_TO,
          userId,
        })._id;
        taskChangeStatus.run({
          taskId: assignmentTaskId,
          newStatus: TASK_STATUS.COMPLETED,
        });
      }
    }
  }
});

setRole.setHandler((context, params) => {
  SecurityService.checkCurrentUserIsDev();
  UserService.setRole(params);
});
