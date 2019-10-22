import React from 'react';
import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';

import AdminSideNavContainer from './AdminSideNavContainer';
import MainSideNav from './MainSideNav';
import DetailSideNav from './DetailSideNav';

const useStyles = makeStyles(() => ({
  drawer: {
    width: showDetail => (showDetail ? 420 : 120),
    flexShrink: 0,
  },
  drawerPaper: {
    width: showDetail => (showDetail ? 420 : 120),
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
