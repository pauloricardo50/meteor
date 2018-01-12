import { Meteor } from 'meteor/meteor';
import { Inject } from 'meteor/meteorhacks:inject-initial';

import 'core/api/api';
import 'core/api/api-server';
import jc from 'core/api/server/jobs/jobs';
import '../accounts-config';
import './accounts-server-config';
import setupMandrill from 'core/api/email/server/email-config';

Meteor.startup(() => {
  // Do something on startup if necessary
  // Add password protection
  // if (Meteor.settings.public.environment === 'staging') {
  //   setupAuth();
  // }

  setupMandrill();

  jc.startJobServer();
});

// Inject a loader before client is ready, is removed in the on startup function on the client
Inject.rawHead('loader', Assets.getText('loader.html'));

// Make sure this is passed a function, so that it gets random strings for
// every client, instead of once on server-startup

// FIXME: This gets picked up by google crawlers..! Very bad
// Inject.rawHead('loadingText', getHtml);
