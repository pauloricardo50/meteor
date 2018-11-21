import { Meteor } from 'meteor/meteor';

import React from 'react';
import PropTypes from 'prop-types';
import { Roles } from 'meteor/alanning:roles';
import { Redirect } from 'react-router-dom';
import { HotKeys } from 'react-hotkeys';

import { handleLoggedOut } from 'core/utils/history';
import ErrorBoundary from 'core/components/ErrorBoundary';
import PageHead from 'core/components/PageHead';
import getBaseRedirect from 'core/utils/redirection';
import AdminTopNav from './AdminTopNav';
import AdminSideNav from './AdminSideNav';
import AdminLayoutContainer from './AdminLayoutContainer';

const getRedirect = ({ currentUser }) => {
  const userIsAdmin = Roles.userIsInRole(currentUser, 'admin');
  const userIsDev = Roles.userIsInRole(currentUser, 'dev');

  if (!(userIsAdmin || userIsDev) && !(Meteor.isTest || Meteor.isAppTest)) {
    window.location.replace(Meteor.settings.public.subdomains.app);
  }

  return false;
};

const AdminLayout = (props) => {
  handleLoggedOut();

  if (window.isRedirectingLoggedOutUser) {
    // if the user is being redirected after logout,
    // prevent any following code from being executed (avoids flickering)
    return null;
  }

  const { history, children } = props;
  const redirect = getRedirect(props);
  const path = history.location.pathname;
  const isLogin = path.slice(0, 6) === '/login';

  if (redirect && !isLogin) {
    return <Redirect to={redirect} />;
  }

  return (
    <div className="admin-layout">
      <HotKeys
        handlers={{ space: () => history.push('/search') }}
        focused
        attach={window}
      />
      <PageHead titleId="AdminLayout" />
      <AdminTopNav {...props} />

      <div className="main-row">
        <AdminSideNav {...props} />

        <div className="main">
          <ErrorBoundary helper="layout" pathname={history.location.pathname}>
            {React.cloneElement(children, { ...props })}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

AdminLayout.defaultProps = {
  currentUser: undefined,
};

AdminLayout.propTypes = {
  children: PropTypes.any.isRequired,
  currentUser: PropTypes.objectOf(PropTypes.any),
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default AdminLayoutContainer(AdminLayout);
