import React from 'react';
import TopNav from 'core/components/TopNav';
import SearchIcon from '../../pages/SearchPage/SearchIcon';

const AdminTopNav = props => (
  <div className="admin-top-nav">
    <TopNav {...props}>
      <SearchIcon />
    </TopNav>
  </div>
);

AdminTopNav.propTypes = {};

export default AdminTopNav;
