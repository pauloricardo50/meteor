import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

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

Accounts.validateLoginAttempt(({ allowed, user }) => {
  if (allowed && user.isDisabled) {
    throw new Meteor.Error('403', 'Account Deactivated');
  }
  return allowed;
});
