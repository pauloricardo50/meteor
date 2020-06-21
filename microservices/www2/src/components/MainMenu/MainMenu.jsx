import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Menu from '@material-ui/core/Menu';
import IconButton from 'core/components/IconButton';
import LoginMenu from '../LoginMenu';
import MenuItems from '../MenuItems';
import getMenuLinks from '../../utils/getMenuLinks';

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
        size="small"
        type="menu"
        tooltip="menu"
      />

      <Menu
        id="main-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItems menuLinks={menuLinks} />

        {matches && <LoginMenu placement="mobile-nav" />}
      </Menu>
    </div>
  );
};

export default MainMenu;
