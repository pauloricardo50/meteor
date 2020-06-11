import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';

import MainSideNav from './MainSideNav';

const useStyles = makeStyles(() => ({
  drawer: {
    width: 100,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 100,
  },
}));

export const AdminSideNav = ({
  toggleDrawer,
  openDrawer,
  isMobile,
  ...otherProps
}) => {
  const classes = useStyles();
  return (
    <Drawer
      className={classes.drawer}
      variant={isMobile ? 'temporary' : 'permanent'}
      classes={{ paper: classes.drawerPaper }}
      open={openDrawer}
      onClose={toggleDrawer}
    >
      <nav className="admin-side-nav">
        <MainSideNav {...otherProps} toggleDrawer={toggleDrawer} />
      </nav>
    </Drawer>
  );
};

export default AdminSideNav;
