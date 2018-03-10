import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import { SecurityService, Tasks } from '../..';
import { TASK_STATUS, TASK_TYPE } from '../../constants';
import { taskChangeStatus, taskChangeAssignedTo } from '../../methods';
import {
  doesUserExist,
  sendVerificationLink,
  assignAdminToUser,
  assignAdminToNewUser,
} from '../methodDefinitions';
import UserService from '../UserService';

doesUserExist.setHandler((context, { email }) => Accounts.findUserByEmail(email) != null);

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

  return Accounts.sendVerificationEmail(id);
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
    const changeTaskAssignedToResult = taskChangeStatus.run({
      taskId,
      newAssignee: adminId,
    });
    if (changeTaskAssignedToResult) {
      // change statuts to "COMPLETED" only for task with type "ADD_ASSIGNED_TO"
      if (taskType === TASK_TYPE.ADD_ASSIGN_TO) {
        taskChangeAssignedTo.run({
          taskId,
          newStatus: TASK_STATUS.COMPLETED,
        });
      } else {
        const assignmentTaskId = Tasks.findOne({
          type: TASK_TYPE.ADD_ASSIGNED_TO,
          userId,
        })._id;
        taskChangeAssignedTo.run({
          taskId: assignmentTaskId,
          newStatus: TASK_STATUS.COMPLETED,
        });
      }
    }
  }
});
