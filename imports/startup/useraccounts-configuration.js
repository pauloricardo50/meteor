import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Accounts } from 'meteor/std:accounts-ui';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Roles } from 'meteor/alanning:roles';


// TODO: Internationalize this shit
// import { TAPi18n } from 'meteor/tap:i18n';

function postLoginRoute() {
  // Route admins and partners to their respective dashboards
  if (Roles.userIsInRole(Meteor.user(), 'admin')) {
    FlowRouter.go('/admin');
  } else if (Roles.userIsInRole(Meteor.user(), 'partner')) {
    FlowRouter.go('/partner');
  }

  // Get path from Session, and set it to an empty string afterwards
  const postLoginPath = Session.get('postLoginPath');
  Session.set('postLoginPath', '');

  // If the user tried to acces a user-route and wasn't logged in, route him to that one on login
  if (postLoginPath) {
    FlowRouter.go(postLoginPath);
  } else {
    FlowRouter.go('/main');
  }
}

// function postSignUpFunc() {
//
//   Roles.addUsersToRoles(Meteor.userId(), 'user');
//
//   postLoginRoute();
// }


Accounts.ui.config({
  passwordSignupFields: 'EMAIL_ONLY',
  loginPath: '/login',
  homeRoutePath: '/',
  profilePath: '/main',
  onPostSignUpHook: () => postLoginRoute(),
  onSignedInHook: () => postLoginRoute(),
});
