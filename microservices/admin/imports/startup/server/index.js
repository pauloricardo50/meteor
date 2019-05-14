import '../shared-startup';

import { Inject } from 'meteor/meteorhacks:inject-initial';
import { Accounts } from 'meteor/accounts-base';
import { ROLES } from 'core/api/constants';

import EVENTS from 'core/api/analytics/events';
import Analytics from 'core/api/analytics/Analytics';

import 'core/api/api-server';
import 'core/api/api';
import 'core/fixtures';

import '../accounts-config';
import './kadira';

import 'core/api/updateWatchers/server/updateWatcherCron';
import './fetchIrs10yCron';

// Inject a loader before client is ready, is removed in the on startup function on the client
Inject.rawHead('loader', Assets.getText('loader.html'));

Accounts.validateLoginAttempt(({ allowed, user }) => {
  if (allowed) {
    return [ROLES.ADMIN, ROLES.DEV].includes(user.roles[0]);
  }

  return false;
});

Accounts.config({ forbidClientAccountCreation: true });

Accounts.onLogin(({ user }) => {
  const { _id: userId } = user;

  Analytics.identify(user);
  Analytics.track({ userId, event: EVENTS.USER.LOGGED_IN });
});
