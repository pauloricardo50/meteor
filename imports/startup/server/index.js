import { Meteor } from 'meteor/meteor';
import { Inject } from 'meteor/meteorhacks:inject-initial';

import '/imports/js/server/emails';
import '/imports/js/server/methods';
import '/imports/js/server/files';
import '/imports/api/api';
import '../accounts-config';
import './accounts-server-config';
import './meteor-slingshot-server';
import setupAuth from './http-auth.js';

Meteor.startup(() => {
  // Do something on startup if necessary
  // Add password protection
  // if (Meteor.settings.public.environment === 'staging') {
  //   setupAuth();
  // }
  process.env.MAIL_URL = Meteor.settings.smtp;
});

// Inject a loader before client is ready, is removed in the on startup function on the client
Inject.rawHead('loader', Assets.getText('loader.html'));
