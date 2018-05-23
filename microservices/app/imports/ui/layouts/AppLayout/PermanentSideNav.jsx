import React from 'react';

import Drawer from '@material-ui/core/Drawer';

import SideNavUser from '../../components/SideNavUser';

const PermanentSideNav = props => (
  <Drawer variant="permanent">
    <div style={{ width: 300 }}>
      <SideNavUser {...props} fixed />
    </div>
  </Drawer>
);

export default PermanentSideNav;
