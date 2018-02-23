import React from 'react';
import PropTypes from 'prop-types';

import SideNav from 'core/components/SideNav';

const AdminSideNav = props => (
  <div className="admin-side-nav">
    <SideNav {...props} />
  </div>
);

AdminSideNav.propTypes = {};

export default AdminSideNav;
