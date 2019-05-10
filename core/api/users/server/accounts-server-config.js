import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import Analytics from '../../analytics/Analytics';

// Accounts.onCreateUser((options, user) => user);
Accounts.config({ forbidClientAccountCreation: !Meteor.isTest });

Accounts.onLogin(({ user }) => {
  const { _id: userId, firstName, lastName, emails, roles } = user;
  const email = emails[0].address;
  const role = roles[0];

  Analytics.identify({
    userId,
    traits: {
      firstName,
      lastName,
      email,
      role,
    },
  });

  Analytics.track({
    userId,
    event: 'User Logged in',
  });
});
