import PropTypes from 'prop-types';
import React from 'react';
import { Roles } from 'meteor/alanning:roles';
import { Redirect } from 'react-router-dom';
import classnames from 'classnames';

import ContactButton from 'core/components/ContactButton';
import ErrorBoundary from 'core/components/ErrorBoundary';
import track from 'core/utils/analytics';
import { isApp, isAdmin, isPartner } from 'core/utils/browserFunctions';
import AdminNavs from './AdminNavs';

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

  if (!(userIsAdmin || userIsDev)) {
    // TODO: Redirect to app subdomain
  }

  return false;
};

const AdminLayout = (props) => {
  const { history, children } = props;
  const redirect = getRedirect(props);
  const classes = classnames({ 'app-layout': true, 'always-side-nav': true });
  const path = history.location.pathname;
  const isLogin = path.slice(0, 6) === '/login';

  if (redirect && !isLogin) {
    return <Redirect to={redirect} />;
  }

  return (
    <div>
      <AdminNavs {...props} />

      <main className={classes}>
        <ErrorBoundary helper="layout" pathname={history.location.pathname}>
          <div x="wrapper">{React.cloneElement(children, { ...props })}</div>
        </ErrorBoundary>
      </main>
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
