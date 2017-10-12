import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '/imports/ui/components/general/IconButton';
import Drawer from 'material-ui/Drawer';
import SideNavUser from '/imports/ui/components/general/SideNavUser';

import DrawerHeader from './DrawerHeader';

const TopNavDrawer = (props) => {
  const { drawerState, toggleDrawer, handleClickLink } = props;
  return (
    <div className="menu-button">
      <IconButton
        onClick={toggleDrawer}
        type="menu"
        tooltip="Menu"
        tooltipPlacement="bottom-start"
      />
      <Drawer open={drawerState} onRequestClose={() => toggleDrawer(false)}>
        <div className="side-nav-drawer" style={{ width: 300 }}>
          <DrawerHeader showButton onClick={() => toggleDrawer(false)} />
          <SideNavUser
            {...props}
            handleClickLink={handleClickLink}
            toggleDrawer={toggleDrawer}
          />
        </div>
      </Drawer>
    </div>
  );
};

TopNavDrawer.propTypes = {
  drawerState: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  handleClickLink: PropTypes.func.isRequired,
};

export default TopNavDrawer;
