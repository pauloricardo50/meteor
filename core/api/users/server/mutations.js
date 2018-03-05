import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import UserService from 'core/api/users/UserService';
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
