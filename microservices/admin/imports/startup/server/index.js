import 'core/startup/server';

import '../shared-startup';

import { Accounts } from 'meteor/accounts-base';
import { Inject } from 'meteor/meteorhacks:inject-initial';

import { localizationStartup } from 'core/utils/localization';

// Inject a loader before client is ready,
// is removed in the on startup function on the client
Inject.rawHead('loader', Assets.getText('loader.html'));

Accounts.config({ forbidClientAccountCreation: true });

localizationStartup();
