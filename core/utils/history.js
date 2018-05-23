import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createBrowserHistory } from 'history';

import { IMPERSONATE_SESSION_KEY } from 'core/api/impersonation/impersonation';

const history = createBrowserHistory();

// used in end to end testing
window.reactRouterDomHistory = history;

export const handleLoggedOut = (redirectToUrl) => {
  if (window.isHandlingLoggedOut) {
    return true;
  }

  if (!Meteor.userId()) {
    // eslint-disable-next-line
    Session.clear(IMPERSONATE_SESSION_KEY);

    const {
      location: { pathname },
    } = history;

    window.isHandlingLoggedOut = true;
    // hard redirect so that all components are unmounted
    // (thus fixing grapher queries & subscription issues)
    window.location.replace(redirectToUrl || `/login?path=${pathname}`);
    return true;
  }

  return false;
};

export default history;
