import PropTypes from 'prop-types';
import React from 'react';
import { Roles } from 'meteor/alanning:roles';
import { Redirect } from 'react-router-dom';
import classnames from 'classnames';

import ContactButton from '/imports/ui/components/general/ContactButton';
import ErrorBoundary from 'core/components/ErrorBoundary';
import track from 'core/utils/analytics';
import { isApp, isAdmin, isPartner } from 'core/utils/browserFunctions';
import Navs from './Navs';

// import UserJoyride from '/imports/ui/components/general/UserJoyride';

const allowedRoutesWithoutRequest = [
  '/',
  '/compare',
  '/profile',
  '/add-request',
  '/enroll',
];

const getRedirect = ({
  currentUser,
  history: { location: { pathname } },
  loanRequests,
}) => {
  return false;

  const userIsAdmin = Roles.userIsInRole(currentUser, 'admin');
  const userIsPartner = Roles.userIsInRole(currentUser, 'partner');
  const userIsDev = Roles.userIsInRole(currentUser, 'dev');

  if (!currentUser) {
    return `/login?path=${pathname}`;
  }

  if (userIsDev) {
    return false;
  }

  if (userIsAdmin) {
    return '/admin';
  } else if (isPartner) {
    return '/isPartner';
  }
  // If there is no active request, force route to app page, except if
  // user is on allowed routes
  if (
    loanRequests &&
    loanRequests.length < 1 &&
    !allowedRoutesWithoutRequest.some(route => pathname.indexOf(route) === 0)
  ) {
    return '/';
  }

  return false;
};

const getShowSideNav = ({ location }) =>
  !(location.pathname === '/' || location.pathname === '/compare');

const AppLayout = (props) => {
  const { type, history, render } = props;
  const redirect = getRedirect(props);
  const showSideNav = true; // getShowSideNav(history);
  const classes = classnames({
    'app-layout': true,
    'always-side-nav': true,
    // 'no-nav': !showSideNav,
  });
  const path = history.location.pathname;
  const isLogin = path.slice(0, 6) === '/login';

  if (redirect && !isLogin) {
    track('AppLayout - was redirected', {
      from: history.location.pathname,
      to: redirect,
    });
    return <Redirect to={redirect} />;
  }

  return (
    <div>
      <Navs
        {...props}
        showSideNav={showSideNav}
        isApp={type === 'app'}
        isAdmin={type === 'admin'}
      />

      <main className={classes}>
        <ErrorBoundary helper="layout" pathname={history.location.pathname}>
          <div x="wrapper">{render(props)}</div>
        </ErrorBoundary>
      </main>

      {type === 'app' && <ContactButton history={history} />}
    </div>
  );
};

AppLayout.defaultProps = {
  type: 'user',
  render: () => null,
  currentUser: undefined,
  noNav: false,
  loanRequests: undefined,
};

AppLayout.propTypes = {
  type: PropTypes.string,
  render: PropTypes.func,
  currentUser: PropTypes.objectOf(PropTypes.any),
  noNav: PropTypes.bool,
  loanRequests: PropTypes.arrayOf(PropTypes.object),
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default AppLayout;
