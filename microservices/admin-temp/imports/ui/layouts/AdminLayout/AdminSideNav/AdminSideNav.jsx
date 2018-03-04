import React from 'react';
import PropTypes from 'prop-types';

import AdminSideNavContainer from './AdminSideNavContainer';
import MainSideNav from './MainSideNav';
import DetailSideNav from './DetailSideNav';

export const AdminSideNav = ({ showDetail, ...otherProps }) => (
  <nav className="admin-side-nav">
    <MainSideNav {...otherProps} />
    {showDetail && <DetailSideNav {...otherProps} />}
  </nav>
);

AdminSideNav.propTypes = {
  showDetail: PropTypes.bool.isRequired,
};

export default AdminSideNavContainer(AdminSideNav);
