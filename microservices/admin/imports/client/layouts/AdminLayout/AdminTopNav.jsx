import React from 'react';

import updateForProps from 'core/containers/updateForProps';
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

export default updateForProps([
  'currentUser._id',
  'currentUser.organisation._id',
  'currentUser.roles',
])(AdminTopNav);
