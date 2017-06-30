import { Meteor } from 'meteor/meteor';
import { Inject } from 'meteor/meteorhacks:inject-initial';

import '/imports/js/server/email/email-methods';
import '/imports/js/server/email/email-meteor';
import '/imports/js/server/files';
import '/imports/api/api';
import '../accounts-config';
import './accounts-server-config';
import './meteor-slingshot-server';
import setupAuth from './http-auth';
import setupMandrill from './email-config';

Meteor.startup(() => {
  // Do something on startup if necessary
  // Add password protection
  // if (Meteor.settings.public.environment === 'staging') {
  //   setupAuth();
  // }

  setupMandrill();
});

// Inject a loader before client is ready, is removed in the on startup function on the client
Inject.rawHead('loader', Assets.getText('loader.html'));
