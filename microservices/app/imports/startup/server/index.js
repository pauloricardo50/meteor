import { Meteor } from 'meteor/meteor';
import { Inject } from 'meteor/meteorhacks:inject-initial';

// Not sure how I would otherwise isolated to this only
import 'core/api/impersonation/server/mutations';

import 'core/api/api';
import 'core/api/api-server';
import jc from 'core/api/jobs/server/jobs';
import '../accounts-config';
import './kadira-dev.js';
import getHtml from './loadingText';

Meteor.startup(() => {
  jc.startJobServer();
});

// Inject a loader before client is ready, is removed in the on startup function on the client
Inject.rawHead('loader', Assets.getText('loader.html'));

// Make sure this is passed a function, so that it gets random strings for
// every client, instead of once on server-startup

// FIXME: This gets picked up by google crawlers..! Very bad
// Inject.rawHead('loadingText', getHtml);
