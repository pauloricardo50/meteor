import React from 'react';
import Menu from '@material-ui/core/Menu';
import IconButton from 'core/components/IconButton';
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
      </Menu>
    </div>
  );
};

export default MainMenu;
