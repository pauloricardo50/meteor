
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

// Globally manages the account login for all the apps
Accounts.validateLoginAttempt(({ allowed, user }) => {
  if (allowed && user.isDisabled) {
    throw new Meteor.Error('403', 'Account Disabled');
  }
  return true;
});
