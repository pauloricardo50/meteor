import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/std:accounts-ui';


// TODO: Internationalize this shit
// import { TAPi18n } from 'meteor/tap:i18n';


Accounts.ui.config({
  passwordSignupFields: 'EMAIL_ONLY',
  loginPath: '/login',
});
