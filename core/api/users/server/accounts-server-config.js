import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import pick from 'lodash/pick';

Accounts.onCreateUser((options, user) => {
  if (options.profile) {
    return {
      ...pick(options.profile, ['firstName', 'lastName', 'phoneNumbers']),
      ...user,
    };
  }

  return user;
});

export const validateLoginAttempt = () => {
  // Globally manages the account's login for all the apps
  Accounts.validateLoginAttempt(({ allowed, user }) => {
    if (allowed && user.isDisabled) {
      throw new Meteor.Error('403', 'Account Deactivated');
    }
    return allowed;
  });
};
