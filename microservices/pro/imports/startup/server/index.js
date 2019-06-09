import { Inject } from 'meteor/meteorhacks:inject-initial';
import { Accounts } from 'meteor/accounts-base';
import { ROLES } from 'core/api/constants';

import 'core/api/initialization';
import './kadira.js';
import './restAPI';

// Inject a loader before client is ready,
// is removed in the on startup function on the client
Inject.rawHead('loader', Assets.getText('loader.html'));

Accounts.validateLoginAttempt(({ allowed, user }) => {
  if (allowed) {
    return [ROLES.PRO, ROLES.ADMIN, ROLES.DEV].includes(user.roles[0]);
  }

  return false;
});

Accounts.config({ forbidClientAccountCreation: true });
