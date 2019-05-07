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
import FileViewer from '../../components/FileViewer';

const getRedirect = ({ currentUser, history }) => {
  const baseRedirect = getBaseRedirect(currentUser, history.location.pathname);
  if (baseRedirect !== undefined) {
    return baseRedirect;
  }

  const userIsAdmin = Roles.userIsInRole(currentUser, 'admin');
  const userIsDev = Roles.userIsInRole(currentUser, 'dev');

  if (!(userIsAdmin || userIsDev) && !(Meteor.isTest || Meteor.isAppTest)) {
    // If `getBaseRedirect` redirected, then we have a race condition. Waiting a
    // second forces let browser resolve that first redirect and eventually
    // reschedule this one.
    setTimeout(() => {
      window.location.replace(Meteor.settings.public.subdomains.app);
    }, 1000);
  }

  return false;
};

const AdminLayout = ({ setOpenSearch, openSearch, children, ...props }) => {
  handleLoggedOut();

  if (window.isRedirectingLoggedOutUser) {
    // if the user is being redirected after logout,
    // prevent any following code from being executed (avoids flickering)
    return null;
  }

  const { history } = props;
  const redirect = getRedirect(props);
  const path = history.location.pathname;
  const isLogin = path.slice(0, 6) === '/login';

  if (redirect && !isLogin) {
    return <Redirect to={redirect} />;
  }

  return (
    <div className="admin-layout">
      <HotKeys
        handlers={{
          space: (e) => {
            // Prevent the space key to be sent to the search input
            e.preventDefault();
            setOpenSearch(true);
          },
        }}
        focused
        attach={window}
      />
      <PageHead titleId="AdminLayout" />
      <AdminTopNav
        {...props}
        openSearch={openSearch}
        setOpenSearch={setOpenSearch}
      />

      <div className="main-row">
        <AdminSideNav {...props} />

        <div className="main">
          <ErrorBoundary helper="layout" pathname={history.location.pathname}>
            {React.cloneElement(children, { ...props })}
          </ErrorBoundary>
        </div>

        <FileViewer />
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
