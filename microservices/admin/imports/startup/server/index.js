import '../shared-startup';
import { Inject } from 'meteor/meteorhacks:inject-initial';
import { Accounts } from 'meteor/accounts-base';
import 'core/startup/server';
import { ROLES } from 'core/api/constants';
import { localizationStartup } from 'core/utils/localization';
import messagesFR from '../../../lang/fr.json';

// Inject a loader before client is ready, is removed in the on startup function on the client
Inject.rawHead('loader', Assets.getText('loader.html'));

Accounts.validateLoginAttempt(({ allowed, user }) => {
  if (allowed) {
    return [ROLES.ADMIN, ROLES.DEV].includes(user.roles[0]);
  }

  return false;
});
Accounts.config({ forbidClientAccountCreation: true });

localizationStartup({ messages: messagesFR });
