import { Meteor } from 'meteor/meteor';

import SecurityService from '../../security';
import {
  doesUserExist,
  sendVerificationLink,
  assignAdminToUser,
  assignAdminToNewUser,
  setRole,
  adminCreateUser,
  updateUser,
  getUserByPasswordResetToken,
  testCreateUser,
  removeUser,
  sendEnrollmentEmail,
  changeEmail,
  generateApiToken,
} from '../methodDefinitions';
import UserService from './UserService';

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

assignAdminToUser.setHandler((context, { userId, adminId }) => {
  SecurityService.checkCurrentUserIsAdmin();

  return UserService.assignAdminToUser({ userId, adminId });
});

assignAdminToNewUser.setHandler((context, { userId, adminId }) => {
  // same action as assignAdminToUser, but with a dedicated
  // listener that would complete & reassign the user's tasks
  SecurityService.checkCurrentUserIsAdmin();

  return UserService.assignAdminToUser({ userId, adminId });
});

setRole.setHandler((context, params) => {
  SecurityService.checkCurrentUserIsAdmin();
  return UserService.setRole(params);
});

adminCreateUser.setHandler((context, { options, role }) => {
  SecurityService.users.isAllowedToInsertByRole({ role });
  return UserService.adminCreateUser({
    options,
    role,
    adminId: context.userId,
  });
});

updateUser.setHandler((context, { userId, object }) => {
  SecurityService.users.isAllowedToUpdate(userId, context.userId);

  if (object.roles) {
    SecurityService.handleUnauthorized('Vous ne pouvez pas changer le rôle');
  }

  return UserService.update({ userId, object });
});

getUserByPasswordResetToken.setHandler((context, params) =>
  UserService.getUserByPasswordResetToken(params));

testCreateUser.setHandler((context, params) => {
  if (Meteor.isTest) {
    return UserService.testCreateUser(params);
  }
});

removeUser.setHandler((context, params) => {
  SecurityService.checkCurrentUserIsDev();
  UserService.remove(params);
});

sendEnrollmentEmail.setHandler((context, params) => {
  SecurityService.checkCurrentUserIsAdmin();
  return UserService.sendEnrollmentEmail(params);
});

changeEmail.setHandler((context, params) => {
  SecurityService.checkCurrentUserIsAdmin();
  return UserService.changeEmail(params);
});

generateApiToken.setHandler((context, { userId }) => {
  if (!SecurityService.currentUserIsAdmin()) {
    SecurityService.checkUserLoggedIn(userId);
  }
  return UserService.generateApiToken({ userId });
});
