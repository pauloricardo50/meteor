import React from 'react';

import updateForProps from 'core/containers/updateForProps';
import TopNav from 'core/components/TopNav';
import Search from '../../components/Search';

const AdminTopNav = ({ setOpenSearch, openSearch, ...props }) => (
  <div className="admin-top-nav">
    <TopNav {...props}>
      <Search openSearch={openSearch} setOpenSearch={setOpenSearch} />
    </TopNav>
  </div>
);

AdminTopNav.propTypes = {};

export default updateForProps([
  'currentUser._id',
  'currentUser.organisation._id',
  'currentUser.roles',
  'openSearch',
])(AdminTopNav);
