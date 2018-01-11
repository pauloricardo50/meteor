import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser((options, user) => {
  const newUser = user;
  newUser.roles = 'user';
  return newUser;
});

Accounts.config({
  forbidClientAccountCreation: false,
});
