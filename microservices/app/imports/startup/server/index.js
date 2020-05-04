import '../shared-startup';
import 'core/startup/server';

import { Accounts } from 'meteor/accounts-base';
import { Inject } from 'meteor/meteorhacks:inject-initial';

// Inject a loader before client is ready,
// is removed in the on startup function on the client
Inject.rawHead('loader', Assets.getText('loader.html'));

Accounts.config({ forbidClientAccountCreation: false });
