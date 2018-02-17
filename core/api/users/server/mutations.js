import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

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
  return Accounts.sendVerificationEmail(id);
});
