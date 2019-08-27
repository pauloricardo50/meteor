import React from 'react';
import PropTypes from 'prop-types';

import TopNav from 'core/components/TopNav';
import AdminSideNav from './AdminSideNav';

const AdminNavs = props => (
  <React.Fragment>
    <TopNav {...props} />
    <AdminSideNav {...props} />
  </React.Fragment>
);

AdminNavs.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  isApp: PropTypes.bool.isRequired,
  showSideNav: PropTypes.bool.isRequired,
};

export default AdminNavs;
