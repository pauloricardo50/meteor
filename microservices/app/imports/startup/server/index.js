import '../shared-startup';

import { Inject } from 'meteor/meteorhacks:inject-initial';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

import 'core/api/api-server';
import 'core/api/api';
import 'core/fixtures';

import '../accounts-config';
import './kadira.js';
import Analytics from 'core/api/analytics/Analytics';
import EVENTS from 'core/api/analytics/events';

// Inject a loader before client is ready,
// is removed in the on startup function on the client
Inject.rawHead('loader', Assets.getText('loader.html'));

Accounts.config({ forbidClientAccountCreation: false });

Accounts.onLogin(() => {
  Analytics.identify(Meteor.user());
  Analytics.track({ userId: Meteor.userId(), event: EVENTS.USER.LOGGED_IN });
});

Analytics.startPageTracking('app');
