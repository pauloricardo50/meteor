import { Meteor } from 'meteor/meteor';

import { localizationStartup } from 'core/utils/localization';

import messagesFR from '../../../lang/fr.json';

localizationStartup({
  setupAccounts: false,
  setupCountries: false,
  messages: messagesFR,
});

Meteor.microservice = 'www';
