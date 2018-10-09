import { Meteor } from 'meteor/meteor';
import { Accounts as AccountsUI } from 'meteor/epotek:accounts-ui';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

AccountsUI.ui.config({
  passwordSignupFields: 'EMAIL_ONLY',
  loginPath: '/login',
  homeRoutePath: '/',
  profilePath: '/',
  minimumPasswordLength: 1,
});

// Accounts.onCreateUser((options, user) => {
//   const newUser = user;
//   newUser.roles = 'user';
//   return newUser;
// });
