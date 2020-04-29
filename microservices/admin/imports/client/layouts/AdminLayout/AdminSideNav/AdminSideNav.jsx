import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import AdminSideNavContainer from './AdminSideNavContainer';
import DetailSideNav from './DetailSideNav';
import MainSideNav from './MainSideNav';

const useStyles = makeStyles(() => ({
  drawer: {
    width: showDetail => (showDetail ? 400 : 100),
    flexShrink: 0,
  },
  drawerPaper: {
    width: showDetail => (showDetail ? 400 : 100),
  },
}));

export const AdminSideNav = ({
  showDetail,
  toggleDrawer,
  openDrawer,
  isMobile,
  ...otherProps
}) => {
  const classes = useStyles(showDetail);
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
        {showDetail && (
          <DetailSideNav {...otherProps} toggleDrawer={toggleDrawer} />
        )}
      </nav>
    </Drawer>
  );
};

AdminSideNav.propTypes = {
  showDetail: PropTypes.bool.isRequired,
};

export default AdminSideNavContainer(AdminSideNav);
