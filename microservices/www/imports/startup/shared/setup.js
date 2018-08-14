import { Meteor } from 'meteor/meteor';
import { localizationStartup } from 'core/utils/localization';

const setup = () => {
  localizationStartup({ setupAccounts: false });
};

Meteor.startup(() => {
  Meteor.microservice = 'www';
  setup();
});
