import '../shared-startup';

import { Inject } from 'meteor/meteorhacks:inject-initial';
import { Accounts } from 'meteor/accounts-base';

import 'core/api/api-server';
import 'core/api/api';
import 'core/fixtures';

import '../accounts-config';
import './kadira.js';
import Analytics from 'core/api/analytics/server/Analytics';
import EVENTS from 'core/api/analytics/events';
import { Meteor } from 'meteor/meteor';

// Inject a loader before client is ready,
// is removed in the on startup function on the client
Inject.rawHead('loader', Assets.getText('loader.html'));

Accounts.config({ forbidClientAccountCreation: false });

Analytics.startPageTracking('app');

Accounts.onLogin(() => {
  Analytics.track({ userId: Meteor.userId(), event: EVENTS.USER.LOGGED_IN });
});
