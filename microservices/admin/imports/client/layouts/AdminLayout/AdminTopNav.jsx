import React from 'react';
import { shouldUpdate } from 'recompose';

import { arePathsUnequal } from 'core/utils/reactFunctions';
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

export default shouldUpdate(arePathsUnequal([
  'currentUser._id',
  'currentUser.organisation._id',
  'currentUser.roles',
]))(AdminTopNav);
