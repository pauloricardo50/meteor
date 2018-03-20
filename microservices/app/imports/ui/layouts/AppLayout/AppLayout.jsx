import PropTypes from 'prop-types';
import React from 'react';
import { Roles } from 'meteor/alanning:roles';
import { Redirect } from 'react-router-dom';
import classnames from 'classnames';

import ContactButton from 'core/components/ContactButton';
import ErrorBoundary from 'core/components/ErrorBoundary';
import track from 'core/utils/analytics';
import UserContainer from 'core/containers/UserContainer';
import Navs from './Navs';
import { IMPERSONATE_ROUTE } from 'core/api/impersonation/impersonation';

// import UserJoyride from '/imports/ui/components/UserJoyride';

const allowedRoutesWithoutLoan = ['/', '/profile', '/add-loan'];

const allowedRoutesWithoutLogin = [
  '/enroll-account',
  '/reset-password',
  IMPERSONATE_ROUTE,
];

const getRedirect = ({
  currentUser,
  history: { location: { pathname } },
  loans,
}) => {
  const userIsAdmin = Roles.userIsInRole(currentUser, 'admin');
  const userIsDev = Roles.userIsInRole(currentUser, 'dev');

  if (!currentUser) {
    if (
      allowedRoutesWithoutLogin.some(route => pathname.indexOf(route) === 0)
    ) {
      return false;
    }
    console.log(pathname, allowedRoutesWithoutLogin);
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
  if (
    loans &&
    loans.length < 1 &&
    !allowedRoutesWithoutLoan.some(route => pathname.indexOf(route) === 0)
  ) {
    return '/';
  }

  return false;
};

const getShowSideNav = ({ location }) => !(location.pathname === '/');

const AppLayout = (props) => {
  const { type, history, render, children } = props;
  const redirect = getRedirect(props);
  const showSideNav = getShowSideNav(history);
  const classes = classnames({
    'app-layout': true,
    'always-side-nav': type === 'admin',
    'no-nav': !showSideNav,
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
          {/* <div x="wrapper">{render(props)}</div> */}
          <div x="wrapper">{React.cloneElement(children, { ...props })}</div>
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
  loans: undefined,
};

AppLayout.propTypes = {
  type: PropTypes.string,
  render: PropTypes.func,
  currentUser: PropTypes.objectOf(PropTypes.any),
  noNav: PropTypes.bool,
  loans: PropTypes.arrayOf(PropTypes.object),
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default UserContainer(AppLayout);
