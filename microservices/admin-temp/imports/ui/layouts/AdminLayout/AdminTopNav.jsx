import React from 'react';
import TopNav from 'core/components/TopNav';

const AdminTopNav = props => <TopNav {...props} public={false} />;

AdminTopNav.propTypes = {};

export default AdminTopNav;
