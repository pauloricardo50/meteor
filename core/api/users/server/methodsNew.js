import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import { SecurityService } from '../..';
import { doesUserExist, sendVerificationLink } from '../methodDefinitions';

doesUserExist.setHandler(({ email }) => Accounts.findUserByEmail(email) != null);

sendVerificationLink.setHandler(({ userId }) => {
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
