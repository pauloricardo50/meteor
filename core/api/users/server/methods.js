import { Meteor } from 'meteor/meteor';

import { SecurityService } from '../..';
import {
  doesUserExist,
  sendVerificationLink,
  assignAdminToUser,
  assignAdminToNewUser,
  setRole,
  adminCreateUser,
  checkPermissionToAddUser,
  editUser,
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
  SecurityService.checkCurrentUserIsDev();
  UserService.setRole(params);
});

adminCreateUser.setHandler((context, { options, role }) => {
  SecurityService.checkCurrentUserIsAdmin();

  return UserService.adminCreateUser({ options, role });
});

checkPermissionToAddUser.setHandler((context, { role }) =>
  UserService.checkPermissionToAddUser({ role }));

editUser.setHandler((context, { userId, object }) => {
  SecurityService.checkCurrentUserIsAdmin();

  return UserService.update({ userId, object });
});
