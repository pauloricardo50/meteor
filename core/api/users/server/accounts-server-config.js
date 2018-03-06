import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser((options, user) => {
  const newUser = user;

  if (Meteor.isDevelopment) {
    newUser.roles = 'dev';
  } else {
    newUser.roles = 'user';
  }

  return newUser;
});

Accounts.config({
  forbidClientAccountCreation: false,
});
