import '../shared-startup';
import { Inject } from 'meteor/meteorhacks:inject-initial';
import { Accounts } from 'meteor/accounts-base';
import { ROLES } from 'core/api/constants';
import { Meteor } from 'meteor/meteor';
import 'core/api/initialization';
import 'core/startup/server/kadira';

// Inject a loader before client is ready,
// is removed in the on startup function on the client
Inject.rawHead('loader', Assets.getText('loader.html'));

Accounts.validateLoginAttempt(({ allowed, user }) => {
  if (user.isDisabled) {
    console.log('herere', user)
    throw new Meteor.Error('403', 'User account is currently disabled');
  } else if (allowed) {
    return [ROLES.PRO, ROLES.ADMIN, ROLES.DEV].includes(user.roles[0]);
  }

  return false;
});

Accounts.config({ forbidClientAccountCreation: true });
