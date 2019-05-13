import { Accounts } from 'meteor/accounts-base';

import pick from 'lodash/pick';
import EVENTS from 'core/api/analytics/events';
import Analytics from '../../analytics/Analytics';

// Accounts.onCreateUser((options, user) => user);
Accounts.config({ forbidClientAccountCreation: !Meteor.isTest });

Accounts.onLogin(({ user }) => {
  const { _id: userId } = user;

  Analytics.identify(user);
  Analytics.track({ userId, event: EVENTS.USER.LOGGED_IN });
});

Accounts.onCreateUser((options, user) => {
  if (options.profile) {
    return {
      ...pick(options.profile, ['firstName', 'lastName', 'phoneNumbers']),
      ...user,
    };
  }
  return user;
});
