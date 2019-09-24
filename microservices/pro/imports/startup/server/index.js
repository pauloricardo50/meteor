import '../shared-startup';
import { Inject } from 'meteor/meteorhacks:inject-initial';
import { Accounts } from 'meteor/accounts-base';
import { ROLES } from 'core/api/constants';
import 'core/api/initialization';
import 'core/startup/server';
import { validateLoginAttempt } from 'core/api/users/server/accounts-server-config';

// Inject a loader before client is ready,
// is removed in the on startup function on the client
Inject.rawHead('loader', Assets.getText('loader.html'));
validateLoginAttempt([ROLES.PRO, ROLES.ADMIN, ROLES.DEV]);


Accounts.config({ forbidClientAccountCreation: true });
