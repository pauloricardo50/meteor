import React from 'react';

import updateForProps from 'core/containers/updateForProps';
import TopNav from 'core/components/TopNav';
import IconButton from 'core/components/IconButton';
import NotificationsManager from '../../components/NotificationsManager';
import AdminSearch from '../../components/AdminSearch';
import TaskAdder from '../../components/TasksTable/TaskAdder';

const AdminTopNav = ({
  setOpenSearch,
  openSearch,
  isMobile,
  toggleDrawer,
  ...props
}) => (
  <div className="admin-top-nav">
    <TopNav
      rightChildren={
        isMobile ? <IconButton onClick={toggleDrawer} type="menu" /> : null
      }
      {...props}
    >
      <TaskAdder label={isMobile ? '+' : undefined} />
      <NotificationsManager />
      <AdminSearch openSearch={openSearch} setOpenSearch={setOpenSearch} />
    </TopNav>
  </div>
);

AdminTopNav.propTypes = {};

export default updateForProps([
  'currentUser._id',
  'currentUser.organisation._id',
  'currentUser.roles',
  'openSearch',
  'isMobile',
])(AdminTopNav);
