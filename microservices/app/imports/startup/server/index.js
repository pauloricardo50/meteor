import '../shared-startup';

import { Inject } from 'meteor/meteorhacks:inject-initial';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';

import 'core/api/api-server';
import 'core/api/api';
import 'core/fixtures';

import '../accounts-config';
import './kadira.js';
import Analytics from 'core/api/analytics/Analytics';
import EVENTS from 'core/api/analytics/events';
import { TRACKING_COOKIE } from 'core/api/analytics/constants';

// Inject a loader before client is ready,
// is removed in the on startup function on the client
Inject.rawHead('loader', Assets.getText('loader.html'));

Accounts.config({ forbidClientAccountCreation: false });

Accounts.onLogin(() => {
  Analytics.identify(Meteor.user());
  Analytics.track({ userId: Meteor.userId(), event: EVENTS.USER.LOGGED_IN });
});

WebApp.connectHandlers.use('/pagetrack', (req, res, next) => {
  const { cookies = {}, query = {} } = req;
  const { userId, path } = query;
  console.log('path:', JSON.stringify(path));
  console.log('userId:', userId);
  const trackingId = cookies[TRACKING_COOKIE];
  console.log('trackingId:', trackingId);
  next();
});
