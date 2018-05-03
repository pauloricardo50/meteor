import { Meteor } from 'meteor/meteor';
import { Inject } from 'meteor/meteorhacks:inject-initial';

import 'core/fixtures';
import 'core/api/api';
import 'core/api/api-server';
import jc from 'core/api/jobs/server/jobs';
import '../accounts-config';
import './kadira-dev.js';
import '../../../cypress/server/methods';

Meteor.startup(() => {
  jc.startJobServer();
});

// Inject a loader before client is ready,
// is removed in the on startup function on the client
Inject.rawHead('loader', Assets.getText('loader.html'));
