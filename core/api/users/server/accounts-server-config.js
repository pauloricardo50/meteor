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
