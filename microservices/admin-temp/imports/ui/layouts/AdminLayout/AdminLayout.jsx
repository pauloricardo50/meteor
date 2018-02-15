import PropTypes from 'prop-types';
import React from 'react';
import { Roles } from 'meteor/alanning:roles';
import { Redirect } from 'react-router-dom';
import classnames from 'classnames';

import ContactButton from 'core/components/ContactButton';
import ErrorBoundary from 'core/components/ErrorBoundary';
import track from 'core/utils/analytics';
import { isApp, isAdmin, isPartner } from 'core/utils/browserFunctions';
import Navs from './Navs';

// import UserJoyride from '/imports/ui/components/UserJoyride';

const allowedRoutesWithoutLoan = [
  '/',
  '/compare',
  '/profile',
  '/add-loan',
  '/enroll',
];

const getRedirect = ({
  currentUser,
  history: { location: { pathname } },
  loans,
}) => {
  const userIsAdmin = Roles.userIsInRole(currentUser, 'admin');
  const userIsPartner = Roles.userIsInRole(currentUser, 'partner');
  const userIsDev = Roles.userIsInRole(currentUser, 'dev');

  if (!currentUser) {
    return `/login?path=${pathname}`;
  }

  return false;

  if (userIsDev) {
    return false;
  }

  if (userIsAdmin) {
    return '/admin';
  } else if (isPartner) {
    return '/isPartner';
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

const getShowSideNav = ({ location }) =>
  !(location.pathname === '/' || location.pathname === '/compare');

const AdminLayout = (props) => {
  const { type, history, children } = props;
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

  console.log('AdminLayout props:', props);

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
          <div x="wrapper">{React.cloneElement(children, { ...props })}</div>
        </ErrorBoundary>
      </main>

      {type === 'app' && <ContactButton history={history} />}
    </div>
  );
};

AdminLayout.defaultProps = {
  type: 'user',
  currentUser: undefined,
  noNav: false,
  loans: undefined,
};

AdminLayout.propTypes = {
  type: PropTypes.string,
  currentUser: PropTypes.objectOf(PropTypes.any),
  noNav: PropTypes.bool,
  loans: PropTypes.arrayOf(PropTypes.object),
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default AdminLayout;
