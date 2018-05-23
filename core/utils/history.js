import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createBrowserHistory } from 'history';

import { IMPERSONATE_SESSION_KEY } from 'core/api/impersonation/impersonation';

const history = createBrowserHistory();

// used in end to end testing
window.reactRouterDomHistory = history;

// if the user logged out, perform whatever after-logout actions are needed,
// especially redirecting them
export const handleLoggedOut = (redirectToUrl) => {
  if (Meteor.userId()) {
    return;
  }

  // don't run this function if it's already running
  if (window.isRedirectingLoggedOutUser) {
    return;
  }

  // make sure we don't receive a non-string argument such as
  // an error or some other object, for example in situations
  // such as `Meteor.logout(handleLoggedOut)`
  if (redirectToUrl && typeof redirectToUrl !== 'string') {
    return;
  }

  const {
    location: { pathname },
  } = history;
  const redirectUrl = redirectToUrl || `/login?path=${pathname}`;

  // eslint-disable-next-line
  Session.clear(IMPERSONATE_SESSION_KEY);

  window.isRedirectingLoggedOutUser = true;
  // hard redirect so that all components are unmounted
  // (thus fixing grapher queries & subscription issues)
  window.location.replace(redirectUrl);
};

export default history;
