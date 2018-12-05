import { Meteor } from 'meteor/meteor';
import '../shared-startup';

import { Inject } from 'meteor/meteorhacks:inject-initial';

import 'core/fixtures';
import 'core/api/api';
import 'core/api/api-server';

import '../accounts-config';
import './kadira.js';
import startAPI from 'core/api/RESTAPI/server';

Meteor.startup(() => {
  startAPI();
});

// Inject a loader before client is ready,
// is removed in the on startup function on the client
Inject.rawHead('loader', Assets.getText('loader.html'));
