import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

import PersonOutline from '@material-ui/icons/PersonOutline';

const LoginMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        aria-controls="login-menu"
        aria-haspopup="true"
        onClick={handleClick}
        variant="raised"
        color="primary"
        size="large"
        startIcon={<PersonOutline />}
      >
        Se connecter
      </Button>

      <Menu
        id="lohin-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem to="https://app.e-potek.ch">Login Clients</MenuItem>
        <MenuItem to="https://pro.e-potek.ch">Login Pro</MenuItem>
      </Menu>
    </div>
  );
};

export default LoginMenu;
