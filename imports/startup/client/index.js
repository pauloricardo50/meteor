import { Meteor } from 'meteor/meteor';
import { TAPi18n } from 'meteor/tap:i18n';

import './routes.js';
import '../useraccounts-configuration.js';


getUserLanguage = function () {
  // Put here the logic for determining the user language

  return 'fr';
};

if (Meteor.isClient) {
  Meteor.startup(function () {
    TAPi18n.setLanguage(getUserLanguage())
      .done(function () {
        Session.set("showLoadingIndicator", false);
      })
      .fail(function (error_message) {
        // Handle the situation
        console.log(error_message);
      });
  });
}
