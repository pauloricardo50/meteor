import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import React, { useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import ErrorBoundary from 'core/components/ErrorBoundary';
import PageHead from 'core/components/PageHead';
import useMedia from 'core/hooks/useMedia';
import { handleLoggedOut } from 'core/utils/history';
import getBaseRedirect from 'core/utils/redirection';
import UpdateNotification from 'core/components/UpdateNotification';

import FileViewer from '../../components/FileViewer';
import AdminKeyboardShortcuts from './AdminKeyboardShortcuts';
import AdminLayoutContainer from './AdminLayoutContainer';
import AdminSideNav from './AdminSideNav';
import AdminTopNav from './AdminTopNav';

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
    // Return REDIRECT to make sure nothing is rendered if we're waiting for a redirect
    return 'REDIRECT';
  }

  return false;
};

const routeHasNoPadding = pathname => {
  if (pathname.startsWith('/board')) {
    return true;
  }
};

const AdminLayout = ({
  setOpenSearch,
  openSearch,
  children,
  currentUser,
  ...props
}) => {
  const isMobile = useMedia({ maxWidth: 768 });
  const [openDrawer, setDrawer] = useState(false);
  const toggleDrawer = () => setDrawer(state => !state);
  handleLoggedOut();

  if (window.isRedirectingLoggedOutUser) {
    // if the user is being redirected after logout,
    // prevent any following code from being executed (avoids flickering)
    return null;
  }

  const { history } = props;
  const redirect = getRedirect({ currentUser, history });
  const path = history.location.pathname;
  const isLogin = path.slice(0, 6) === '/login';

  if (redirect === 'REDIRECT') {
    return null;
  }

  if (redirect && !isLogin) {
    console.log('redirect:', redirect);
    return <Redirect to={redirect} />;
  }

  return (
    <div className="admin-layout">
      <AdminKeyboardShortcuts setOpenSearch={setOpenSearch} />
      <PageHead titleId="AdminLayout" />
      <AdminTopNav
        {...props}
        openSearch={openSearch}
        setOpenSearch={setOpenSearch}
        isMobile={isMobile}
        toggleDrawer={toggleDrawer}
      />

      <AdminSideNav
        {...props}
        isMobile={isMobile}
        openDrawer={openDrawer}
        toggleDrawer={toggleDrawer}
      />

      <div
        className={cx('main', {
          'no-padding': routeHasNoPadding(history.location.pathname),
          'is-mobile': isMobile,
        })}
      >
        <ErrorBoundary helper="layout" pathname={history.location.pathname}>
          {React.cloneElement(children, { ...props, currentUser })}
        </ErrorBoundary>
      </div>
      <UpdateNotification />
      <FileViewer />
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
