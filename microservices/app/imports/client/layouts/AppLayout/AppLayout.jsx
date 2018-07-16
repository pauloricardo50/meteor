import PropTypes from 'prop-types';
import React from 'react';
import { Roles } from 'meteor/alanning:roles';
import { Redirect } from 'react-router-dom';
import classnames from 'classnames';

import ContactButton from 'core/components/ContactButton';
import ErrorBoundary from 'core/components/ErrorBoundary';
import track from 'core/utils/analytics';
import { IMPERSONATE_ROUTE } from 'core/api/impersonation/impersonation';
import Navs from './Navs';

import AppLayoutContainer from './AppLayoutContainer';

const allowedRoutesWithoutLoan = ['/', '/profile', '/add-loan'];

const allowedRoutesWithoutLogin = [
  '/enroll-account',
  '/reset-password',
  IMPERSONATE_ROUTE,
];

const routesWithoutSidenav = ['/'];

const getRedirect = ({
  currentUser,
  history: {
    location: { pathname },
  },
}) => {
  const userIsAdmin = Roles.userIsInRole(currentUser, 'admin');
  const userIsDev = Roles.userIsInRole(currentUser, 'dev');

  if (!currentUser) {
    if (
      allowedRoutesWithoutLogin.some(route => pathname.indexOf(route) === 0)
    ) {
      return false;
    }
    return `/login?path=${pathname}`;
  }

  if (userIsDev) {
    return false;
  }

  if (userIsAdmin) {
    return '/admin';
  }
  // If there is no active loan, force route to app page, except if
  // user is on allowed routes
  const { loans } = currentUser;
  if (
    loans &&
    loans.length < 1 &&
    !allowedRoutesWithoutLoan.some(route => pathname.indexOf(route) === 0)
  ) {
    return '/';
  }

  return false;
};

const getShowSideNav = ({ location }) =>
  routesWithoutSidenav.indexOf(location.pathname) === -1;

const AppLayout = (props) => {
  // console.log('Applayout props:', props);
  const { history, children } = props;
  const redirect = getRedirect(props);
  const showSideNav = getShowSideNav(history);
  const classes = classnames({ 'app-layout': true, 'no-nav': !showSideNav });
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
    <div className="app-root">
      <Navs {...props} showSideNav={showSideNav} />

      <div className={classes}>
        <ErrorBoundary helper="layout" pathname={history.location.pathname}>
          <div x="wrapper">{React.cloneElement(children, { ...props })}</div>
        </ErrorBoundary>
      </div>

      <ContactButton history={history} />
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
  currentUser: PropTypes.objectOf(PropTypes.any),
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

AppLayout.defaultProps = {
  currentUser: undefined,
};

export default AppLayoutContainer(AppLayout);
