import { Meteor } from 'meteor/meteor';

import { localizationStartup } from 'core/utils/localization';

localizationStartup({
  setupAccounts: false,
  setupCountries: false,
});

Meteor.microservice = 'www';
