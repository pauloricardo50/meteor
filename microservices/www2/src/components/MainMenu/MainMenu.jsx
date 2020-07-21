import React from 'react';
import Menu from '@material-ui/core/Menu';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import IconButton from 'core/components/IconButton';

import getMenuLinks from '../../utils/getMenuLinks';
import LoginMenu from '../LoginMenu';
import MenuItems from '../MenuItems';

const MainMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const matches = useMediaQuery(theme => theme.breakpoints.down('md'));

  const menuLinks = getMenuLinks('main');

  return (
    <div>
      <IconButton
        aria-controls="main-menu"
        aria-haspopup="true"
        onClick={handleClick}
        type="menu"
        tooltip="Menu"
        className="top-nav-menu"
      />

      <Menu
        id="main-menu"
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        getContentAnchorEl={null}
      >
        <MenuItems menuLinks={menuLinks} onClick={handleClose} />

        {matches && <LoginMenu placement="mobile-nav" />}
      </Menu>
    </div>
  );
};

export default MainMenu;
