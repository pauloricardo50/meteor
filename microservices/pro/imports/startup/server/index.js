/* globals Assets */

import '../shared-startup';
import 'core/startup/server/monti';

import { Accounts } from 'meteor/accounts-base';
import { Inject } from 'meteor/meteorhacks:inject-initial';

// Inject a loader before client is ready,
// is removed in the on startup function on the client
Inject.rawBody('loader', Assets.getText('loader.html'));

// TODO: need to see how to make roles working

Accounts.config({ forbidClientAccountCreation: true });
