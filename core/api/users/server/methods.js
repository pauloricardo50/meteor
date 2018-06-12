import { Meteor } from 'meteor/meteor';

import { SecurityService } from '../..';
import UserSecurity from '../../security/collections/UserSecurity';
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
  UserSecurity.checkPermissionToAddUser({ role });

  return UserService.adminCreateUser({ options, role });
});

editUser.setHandler((context, { userId, object }) => {
  if (!SecurityService.currentUserIsAdmin()) {
    SecurityService.checkUserLoggedIn(userId);
  }

  return UserService.update({ userId, object });
});
