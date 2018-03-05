import React from 'react';
import TopNav from 'core/components/TopNav';

const AdminTopNav = props => (
  <div className="admin-top-nav">
    <TopNav {...props} public={false} />
  </div>
);

AdminTopNav.propTypes = {};

export default AdminTopNav;
