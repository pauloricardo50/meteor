import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import UserService from 'core/api/users/UserService';
// import TaskService from 'core/api/tasks/TaskService';
import { Tasks, callMutation, mutations } from 'core/api';
import { TASK_STATUS, TASK_TYPE } from 'core/api/tasks/taskConstants';
import { SecurityService, createMutator } from '../..';
import * as defs from '../mutationDefinitions';

createMutator(
  defs.DOES_USER_EXIST,
  ({ email }) => Accounts.findUserByEmail(email) != null,
);

createMutator(defs.SEND_VERIFICATION_LINK, ({ userId }) => {
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

createMutator(defs.ASSIGN_ADMIN_TO_USER, ({ userId, adminId }) =>
  UserService.assignAdminToUser({ userId, adminId }));

createMutator(
  defs.ASSIGN_ADMIN_TO_NEW_USER_TASK,
  ({ userId, adminId, taskId, taskType }) => {
    const assignAdminToUserResult = callMutation(
      mutations.ASSIGN_ADMIN_TO_USER,
      {
        userId,
        adminId,
      },
    );
    if (assignAdminToUserResult) {
      SecurityService.tasks.isAllowedToUpdate(taskId);
      const changeTaskAssignedToResult = callMutation(
        mutations.TASK_CHANGE_ASSIGNED_TO,
        {
          taskId,
          newAssignee: adminId,
        },
      );
      if (changeTaskAssignedToResult) {
        // change statuts to "COMPLETED" only for task with type "ADD_ASSIGNED_TO"
        if (taskType === TASK_TYPE.ADD_ASSIGN_TO) {
          callMutation(mutations.TASK_CHANGE_STATUS, {
            taskId,
            newStatus: TASK_STATUS.COMPLETED,
          });
        } else {
          const assignmentTaskId = Tasks.findOne({
            type: TASK_TYPE.ADD_ASSIGNED_TO,
            userId,
          })._id;
          callMutation(mutations.TASK_CHANGE_STATUS, {
            taskId: assignmentTaskId,
            newStatus: TASK_STATUS.COMPLETED,
          });
        }
      }
    }
  },
);
