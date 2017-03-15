import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Accounts } from 'meteor/std:accounts-ui';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Roles } from 'meteor/alanning:roles';

// TODO: Internationalize this shit
// import { TAPi18n } from 'meteor/tap:i18n';

function postLoginRoute() {
  // Get postLoginPath from Session, and set it to an empty string afterwards
  const postLoginPath = Session.get('postLoginPath');
  Session.set('postLoginPath', '');

  // Route everyone to their respective homes, except if there is a postLoginPath
  if (postLoginPath) {
    FlowRouter.go(postLoginPath);
  } else if (Roles.userIsInRole(Meteor.user(), 'admin')) {
    FlowRouter.go('/admin');
  } else if (Roles.userIsInRole(Meteor.user(), 'partner')) {
    FlowRouter.go('/partner');
  } else {
    FlowRouter.go('/main');
  }
}

Accounts.ui.config({
  passwordSignupFields: 'EMAIL_ONLY',
  loginPath: '/login',
  homeRoutePath: '/',
  profilePath: '/main',
  onPostSignUpHook: () => postLoginRoute(),
  onSignedInHook: () => postLoginRoute(),
});
