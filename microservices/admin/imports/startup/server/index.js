import '../shared-startup';
import { Inject } from 'meteor/meteorhacks:inject-initial';
import { Accounts } from 'meteor/accounts-base';
import 'core/startup/server';
import { localizationStartup } from 'core/utils/localization';
import messagesFR from '../../../lang/fr.json';

// Inject a loader before client is ready,
// is removed in the on startup function on the client
Inject.rawHead('loader', Assets.getText('loader.html'));


Accounts.config({ forbidClientAccountCreation: true });

localizationStartup({ messages: messagesFR });
