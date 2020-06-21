import React, { useContext, useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import PersonOutline from '@material-ui/icons/PersonOutline';
import { makeStyles } from '@material-ui/core/styles';
import LanguageContext from '../../contexts/LanguageContext';
import { getLanguageData } from '../../utils/languages';
import './LoginMenu.scss';

const useStyles = makeStyles(theme => ({
  root: {
    marginRight: '48px',
    fontSize: '16px',
    fontWeight: 300,
    fontStyle: 'normal',
    lineHeight: 1.44,
    letterSpacing: 'normal',
    color: 'black',
    '& [class*="MuiSvgIcon-root"]': {
      color: theme.palette.primary.main,
    },
  },
}));

const LoginMenu = ({ placement }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [language] = useContext(LanguageContext);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div
      className={`login-menu${
        placement === 'mobile-nav' ? ' mobile-nav' : null
      }`}
    >
      <Button
        classes={useStyles()}
        aria-controls="login-menu"
        aria-haspopup="true"
        onClick={handleClick}
        variant="raised"
        color="primary"
        size="large"
        startIcon={<PersonOutline />}
      >
        {getLanguageData(language).loginText}
      </Button>

      <Menu
        id="login-menu"
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
