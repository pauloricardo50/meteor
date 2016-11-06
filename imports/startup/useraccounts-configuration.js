import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/std:accounts-ui';
import { FlowRouter } from 'meteor/kadira:flow-router';


// TODO: Internationalize this shit
// import { TAPi18n } from 'meteor/tap:i18n';


Accounts.ui.config({
  passwordSignupFields: 'EMAIL_ONLY',
  loginPath: '/login',
  onSignedInHook: () => FlowRouter.go('/main'),
  onSignedOutHook: () => FlowRouter.go('/'),
});
