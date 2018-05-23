import PropTypes from 'prop-types';
import React from 'react';
import { Roles } from 'meteor/alanning:roles';
import { Redirect } from 'react-router-dom';

import { handleLoggedOut } from 'core/utils/history';
import ErrorBoundary from 'core/components/ErrorBoundary';
import AdminTopNav from './AdminTopNav';
import AdminSideNav from './AdminSideNav';
import AdminLayoutContainer from './AdminLayoutContainer';

const getRedirect = ({ currentUser }) => {
  const userIsAdmin = Roles.userIsInRole(currentUser, 'admin');
  const userIsDev = Roles.userIsInRole(currentUser, 'dev');

  if (!(userIsAdmin || userIsDev)) {
    // TODO: Redirect to app subdomain
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
  currentUser: PropTypes.objectOf(PropTypes.any),
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  children: PropTypes.any.isRequired,
};

export default AdminLayoutContainer(AdminLayout);
