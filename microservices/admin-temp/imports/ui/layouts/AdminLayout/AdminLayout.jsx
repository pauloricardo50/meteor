import PropTypes from 'prop-types';
import React from 'react';
import { Roles } from 'meteor/alanning:roles';
import { Redirect } from 'react-router-dom';

import ErrorBoundary from 'core/components/ErrorBoundary';
import AdminTopNav from './AdminTopNav';
import AdminSideNav from './AdminSideNav';

const getRedirect = ({ currentUser, history: { location: { pathname } } }) => {
  const userIsAdmin = Roles.userIsInRole(currentUser, 'admin');
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
  const path = history.location.pathname;
  const isLogin = path.slice(0, 6) === '/login';

  if (redirect && !isLogin) {
    return <Redirect to={redirect} />;
  }

  return (
    <div className="admin-layout">
      <AdminSideNav {...props} />

      <div className="main-column">
        <AdminTopNav {...props} />

        <main>
          <ErrorBoundary helper="layout" pathname={history.location.pathname}>
            {React.cloneElement(children, { ...props })}
          </ErrorBoundary>
        </main>
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

export default AdminLayout;
