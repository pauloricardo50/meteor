import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/std:accounts-ui';
import { FlowRouter } from 'meteor/kadira:flow-router';


// TODO: Internationalize this shit
// import { TAPi18n } from 'meteor/tap:i18n';

function postLoginRoute() {
  const route = FlowRouter.getQueryParam('route');

  // If the user tried to acces a user-route and wasn't logged in, route him to that one on login
  if (route) {
    FlowRouter.go(route);
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
