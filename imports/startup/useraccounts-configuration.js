import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Accounts } from 'meteor/std:accounts-ui';
import { FlowRouter } from 'meteor/kadira:flow-router';


// TODO: Internationalize this shit
// import { TAPi18n } from 'meteor/tap:i18n';

function postLoginRoute() {
  // const current = FlowRouter.current();
  //
  // const pathDef = `/${current.params.nextPath}`;
  // const params = {};
  // const queryParams = current.queryParams;
  // const path = FlowRouter.path(pathDef, params, queryParams);
  //
  // console.log(path);

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


Accounts.ui.config({
  passwordSignupFields: 'EMAIL_ONLY',
  loginPath: '/login',
  homeRoutePath: '/',
  profilePath: '/main',
  onPostSignUpHook: () => postLoginRoute(),
  onSignedInHook: () => postLoginRoute(),
});
