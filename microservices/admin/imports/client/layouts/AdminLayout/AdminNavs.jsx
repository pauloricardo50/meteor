import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import TopNav from 'core/components/TopNav';
import AdminSideNav from './AdminSideNav';

const AdminNavs = props => (
  <div>
    <TopNav {...props} public={false} />
    <AdminSideNav {...props} />
  </div>
);

AdminNavs.propTypes = {
  showSideNav: PropTypes.bool.isRequired,
  isApp: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

export default AdminNavs;
