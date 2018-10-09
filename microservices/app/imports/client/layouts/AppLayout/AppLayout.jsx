import PropTypes from 'prop-types';
import React from 'react';
import { Roles } from 'meteor/alanning:roles';
import { Redirect } from 'react-router-dom';
import classnames from 'classnames';

import ContactButton from 'core/components/ContactButton';
import { LayoutErrorBoundary } from 'core/components/ErrorBoundary';
import { IMPERSONATE_ROUTE } from 'core/api/impersonation/impersonation';
import { ROLES } from 'core/api/constants';
import Navs from './Navs';
import AppLayoutContainer from './AppLayoutContainer';

const WITHOUT_LOAN = [
  '/profile',
  '/add-loan',
  '/enroll-account',
  '/reset-password',
];

const WITHOUT_LOGIN = [
  '/login',
  '/enroll-account',
  '/reset-password',
  IMPERSONATE_ROUTE,
];

const routesWithoutSidenav = ['/'];

const isOnAllowedRoute = (path, routes) =>
  routes.some(allowedRoute => path.startsWith(allowedRoute));

const isOnAllowedRouteWithoutLoan = (loans, path) =>
  (!loans || loans.length < 1)
  && path !== '/'
  && !isOnAllowedRoute(path, WITHOUT_LOAN);

export const getRedirect = (currentUser, pathname) => {
  if (!currentUser) {
    return isOnAllowedRoute(pathname, WITHOUT_LOGIN)
      ? false
      : `/login?path=${pathname}`;
  }

  const userIsDev = Roles.userIsInRole(currentUser, ROLES.DEV);

  if (userIsDev) {
    return false;
  }

  // If there is no active loan, force route to app page, except if
  // user is on allowed routes
  const { loans } = currentUser;
  if (isOnAllowedRouteWithoutLoan(loans, pathname)) {
    return '/';
  }

  return false;
};

const getShowSideNav = ({ location }) =>
  routesWithoutSidenav.indexOf(location.pathname) === -1;

const AppLayout = (props) => {
  // console.log('Applayout props:', props);
  const { history, children, currentUser } = props;
  const redirect = getRedirect(currentUser, history.location.pathname);
  const showSideNav = getShowSideNav(history);
  const classes = classnames({ 'app-layout': true, 'no-nav': !showSideNav });
  const path = history.location.pathname;
  const isLogin = path.slice(0, 6) === '/login';

  if (redirect && !isLogin) {
    return <Redirect to={redirect} />;
  }

  console.log('loan:', props.loan);

  return (
    <div className="app-root">
      <Navs {...props} showSideNav={showSideNav} />

      <div className={classes}>
        <LayoutErrorBoundary>
          <div className="wrapper">{React.cloneElement(children, props)}</div>
        </LayoutErrorBoundary>
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
