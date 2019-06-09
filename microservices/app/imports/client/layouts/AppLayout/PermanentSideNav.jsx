import React from 'react';

import Drawer from '@material-ui/core/Drawer';

import useMedia from 'core/hooks/useMedia';
import SideNavUser from '../../components/SideNavUser';

const PermanentSideNav = ({ open, closeDrawer, ...props }) => {
  const isMobile = useMedia({ maxWidth: 768 });

  return (
    <Drawer
      open={open}
      onClose={closeDrawer}
      variant={isMobile ? 'temporary' : 'permanent'}
    >
      <div style={{ width: 250 }}>
        <SideNavUser closeDrawer={closeDrawer} {...props} fixed />
      </div>
    </Drawer>
  );
};

export default PermanentSideNav;
