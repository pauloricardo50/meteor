import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser((options, user) => {
  const newUser = user;
  newUser.roles = 'user';
  return newUser;
});
