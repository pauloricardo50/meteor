import React, { useState } from 'react';
import { compose, withProps } from 'recompose';

import updateForProps from 'core/containers/updateForProps';
import TopNav from 'core/components/TopNav';
import IconButton from 'core/components/IconButton';
import useSearchParams from 'core/hooks/useSearchParams';
import NotificationsManager from '../../components/NotificationsManager';
import AdminSearch from '../../components/AdminSearch';
import TaskAdder from '../../components/TasksTable/TaskAdder';

const AdminTopNav = ({
  setOpenSearch,
  openSearch,
  isMobile,
  toggleDrawer,
  model,
  openOnMount,
  resetForm,
  ...props
}) => (
  <div className="admin-top-nav">
    <TopNav
      rightChildren={
        isMobile ? <IconButton onClick={toggleDrawer} type="menu" /> : null
      }
      {...props}
    >
      <TaskAdder
        label={isMobile ? '+' : undefined}
        reset
        model={model}
        resetForm={resetForm}
        openOnMount={openOnMount}
      />
      <NotificationsManager />
      <AdminSearch openSearch={openSearch} setOpenSearch={setOpenSearch} />
    </TopNav>
  </div>
);

AdminTopNav.propTypes = {};

export default compose(
  updateForProps([
    'currentUser._id',
    'currentUser.organisation._id',
    'currentUser.roles',
    'openSearch',
    'isMobile',
  ]),
  withProps(() => {
    const initialSearchParams = useSearchParams();
    const [searchParams, setSearchParams] = useState(initialSearchParams);
    return {
      model: searchParams,
      openOnMount: searchParams.addUnlinkedTask,
      resetForm: () => setSearchParams({}),
    };
  }),
)(AdminTopNav);
