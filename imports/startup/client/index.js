import { Meteor } from 'meteor/meteor';
// import { TAPi18n } from 'meteor/tap:i18n';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { T9n } from 'meteor/softwarerero:accounts-t9n';


import './routes';
import '../useraccounts-configuration';
import '../meteor-slingshot';

// getUserLanguage = function () {
//   // Put here the logic for determining the user language
//
//   return 'fr';
// };

if (Meteor.isClient) {
  Meteor.startup(function () {
    // For the meteor accounts package, translates the login page
    T9n.setLanguage('fr');
    // TAPi18n.setLanguage(getUserLanguage())
    //   .done(function () {
    //     Session.set("showLoadingIndicator", false);
    //   })
    //   .fail(function (error_message) {
    //     // Handle the situation
    //     console.log(error_message);
    //   });
  });
}

// Very important for all advanced tap/react/buttons/material-ui to work.
// Might not be required in future react versions
injectTapEventPlugin();
